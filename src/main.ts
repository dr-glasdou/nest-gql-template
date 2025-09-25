import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { envs } from './config';
import { ExceptionsFilter } from './filters';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true }); // Enable CORS for all origins

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new ExceptionsFilter());

  await app.listen(envs.port);
  logger.log(`Application is running on: ${await app.getUrl()}/v1/gql`);
}

bootstrap().catch((error) => {
  logger.error('Error during application bootstrap:', error);
  process.exit(1);
});
