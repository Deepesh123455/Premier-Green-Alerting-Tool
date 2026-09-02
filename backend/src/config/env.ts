import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().optional(),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;

// CORS_ORIGIN is a comma-separated list since 4 independent frontend apps
// (dashboard, entry-exit, truck-log, incoming-report) call this one backend.
export const corsOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
