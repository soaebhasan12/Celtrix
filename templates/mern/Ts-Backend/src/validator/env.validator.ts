import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.string().default('5000'),
  HOST: z.string().default('localhost'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  CORS_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default(true),
  RATE_LIMIT_ENABLED: z
    .string()
    .transform((v) => v === 'true')
    .default(false),
  ENABLE_RATE_LIMITING: z
    .string()
    .transform((v) => v === 'true')
    .default(false),

  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.string().default('7d'),
  DB_NAME: z.string(),
  DB_CONNECTION_STRING: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  UPLOAD_DIR: z.string(),
  TEMP_DIR: z.string(),
  MAX_FILE_SIZE: z.string(),
});
