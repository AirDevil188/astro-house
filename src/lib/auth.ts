import { betterAuth } from 'better-auth';
import db from '../db/index';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
});
