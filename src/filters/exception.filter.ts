import {
  type ArgumentsHost,
  BadRequestException,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';

interface ValidationErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const url = request?.url;

    // Skip logging for favicon.ico requests
    if (url === '/favicon.ico') {
      return;
    }

    this.logger.error(`Exception caught: ${JSON.stringify(exception)}`);

    // Handle existing GraphQL errors
    if (exception instanceof GraphQLError) {
      const { message: gqlMessage, extensions } = exception;
      const { code = HttpStatus.INTERNAL_SERVER_ERROR } = extensions || {};
      throw new GraphQLError(gqlMessage, {
        extensions: {
          status: code,
          timestamp: new Date().toISOString(),
          errors: [],
        },
      });
    }

    // Handle non-HTTP exceptions
    if (!(exception instanceof HttpException)) {
      this.logger.error(`Unhandled exception: ${exception}`, exception instanceof Error ? exception.stack : undefined);

      throw new GraphQLError('Internal server error', {
        extensions: {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
          errors: ['Internal Server Error'],
        },
      });
    }

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ValidationErrorResponse | string;

    const message =
      typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message || exception.message;

    const error = typeof exceptionResponse === 'string' ? exception.name : exceptionResponse.error || exception.name;

    // Special handling for validation errors
    const isValidationError = exception instanceof BadRequestException && Array.isArray(message);
    const finalMessage = isValidationError ? 'Validation error' : message;
    const finalErrors = isValidationError ? message : [error];

    this.logger.error(`GraphQL Exception: (${status}) - ${JSON.stringify(message)}`);

    throw new GraphQLError(finalMessage as string, {
      extensions: {
        statusCode: status,
        timestamp: new Date().toISOString(),
        errors: finalErrors,
      },
    });
  }
}
