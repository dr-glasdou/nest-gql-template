import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { envs } from './config';
import { HealthModule } from './modules';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      introspection: envs.graphqlIntrospection,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      useGlobalPrefix: true,
      path: '/v1/gql',
      formatError: (error) => {
        const { message, extensions, path } = error;
        const { status = HttpStatus.BAD_REQUEST, timestamp = new Date().toISOString(), errors = [] } = extensions || {};
        return { path, message, errors, status, timestamp };
      },
    }),
    HealthModule,
  ],
})
export class AppModule {}
