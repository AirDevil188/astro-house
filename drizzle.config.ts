import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { env } from './env';

dotenv.config({
  path: '.env.local',
  override: true,
});

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
