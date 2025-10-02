import 'dotenv/config';
import joi from 'joi';

interface EnvVars {
  PORT: number;
  STAGE: 'dev' | 'prod' | 'staging';
  GRAPHQL_INTROSPECTION: boolean;
  PG_USER: string;
  PG_PASSWORD: string;
  POSTGRES_DB: string;
  DATABASE_URL: string;
  PGADMIN_EMAIL: string;
  PGADMIN_PASSWORD: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().default(3000),
    STAGE: joi.string().valid('dev', 'prod', 'staging').default('dev'),
    GRAPHQL_INTROSPECTION: joi.boolean().default(false),
    PG_USER: joi.string().required(),
    PG_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    DATABASE_URL: joi.string().required(),
    PGADMIN_EMAIL: joi.string().email().default('admin@example.com'),
    PGADMIN_PASSWORD: joi.string().required().default('Abcd@1234'),
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

export const envs = {
  port: envVars.PORT,
  stage: envVars.STAGE,
  graphqlIntrospection: envVars.GRAPHQL_INTROSPECTION,
  pgUser: envVars.PG_USER,
  pgPassword: envVars.PG_PASSWORD,
  pgDb: envVars.POSTGRES_DB,
  databaseUrl: envVars.DATABASE_URL,
  pgAdminEmail: envVars.PGADMIN_EMAIL,
  pgAdminPassword: envVars.PGADMIN_PASSWORD,
};
