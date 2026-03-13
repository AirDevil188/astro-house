// load custom env

import { env as loadEnv } from 'custom-env';
import { z } from 'zod';

process.env.APP_STAGE = process.env.APP_STAGE || 'development';

const isProduction = process.env.APP_STAGE === 'production';
const isDevelopment = process.env.APP_STAGE === 'development';
const isTest = process.env.APP_STAGE === 'test';

if (isDevelopment) {
  loadEnv('local');
} else if (isTest) {
  loadEnv('test');
} else if (isProduction) {
  loadEnv();
}

// make zod schema

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().positive().default(3000),
  HOST: z.string().default('localhost'),
  APP_STAGE: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  BETTER_AUTH_URL: z.string().startsWith('http://'),
  BETTER_AUTH_SECRET: z.string().length(32),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  CLOUDINARY_API_CLOUD_NAME: z.string().length(9),
  CLOUDINARY_API_SECRET: z.string().length(27),
  CLOUDINARY_API_KEY: z.string().length(15),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;
try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Invalid environment variables:');
    const flattened = z.flattenError(error);
    console.error(JSON.stringify(flattened.fieldErrors, null, 2));

    error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      console.error(`  ${path}: ${issue.message}`);
    });

    process.exit(1);
  }
  throw error;
}

// load env based on the env variables

export const isProd = () => env.NODE_ENV === 'production';
export const isDev = () => env.NODE_ENV === 'development';
export const isTestEnv = () => env.NODE_ENV === 'test';

// console logs

console.log(`✅ App is currently running in ${env.APP_STAGE} environment`);
console.log(`HOST: ${env.HOST}`);
console.log(`PORT: ${env.PORT}`);

export { env };
export default env;
