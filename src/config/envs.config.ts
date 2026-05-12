import 'dotenv/config';
import joi from 'joi';

interface EnvVars {
  PORT: number;
  STAGE: 'dev' | 'prod' | 'staging';
  GRAPHQL_INTROSPECTION: boolean;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_DB: string;
  PG_HOST: string;
  PG_PORT: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB: number;
  REDIS_MAX_RETRIES: number;
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    STAGE: joi.string().valid('dev', 'prod', 'staging').default('dev'),
    GRAPHQL_INTROSPECTION: joi.boolean().default(false),
    PG_USER: joi.string().required(),
    PG_PASSWORD: joi.string().required(),
    PG_DB: joi.string().required(),
    PG_HOST: joi.string().required(),
    REDIS_HOST: joi.string().default('localhost'),
    REDIS_PORT: joi.number().default(6379),
    REDIS_PASSWORD: joi.string().default('admin'),
    REDIS_DB: joi.number().default(0),
    REDIS_MAX_RETRIES: joi.number().default(5),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
}) as {
  error: Error | undefined;
  value: EnvVars;
};

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

// Encode values to avoid special characters in URLs
const encodedValues = {
  pg: {
    pass: encodeURIComponent(envVars.PG_PASSWORD),
    user: encodeURIComponent(envVars.PG_USER),
    db: encodeURIComponent(envVars.PG_DB),
  },
  redis: {
    pass: encodeURIComponent(envVars.REDIS_PASSWORD),
  },
};

export const envs = {
  port: envVars.PORT,
  stage: envVars.STAGE,
  graphqlIntrospection: envVars.GRAPHQL_INTROSPECTION,
  isProd: process.env.NODE_ENV === 'production',
  pg: {
    user: envVars.PG_USER,
    password: encodedValues.pg.pass,
    db: envVars.PG_DB,
    host: envVars.PG_HOST,
    port: envVars.PG_PORT,
    url: `postgres://${encodedValues.pg.user}:${encodedValues.pg.pass}@${envVars.PG_HOST}:${envVars.PG_PORT}/${encodedValues.pg.db}`,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: encodedValues.redis.pass,
    db: envVars.REDIS_DB,
    maxRetries: envVars.REDIS_MAX_RETRIES,
    url: `redis://${envVars.REDIS_HOST}:${envVars.REDIS_PORT}/${envVars.REDIS_DB}`,
  },
};
