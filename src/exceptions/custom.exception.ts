import { GraphQLError } from 'graphql';

export class CustomException extends GraphQLError {
  constructor(options: { message: string; status: number }) {
    super(options.message, {
      extensions: { code: options.status.toString() },
    });
    this.extensions.stack = this.stack;
  }
}
