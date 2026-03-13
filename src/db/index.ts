import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../../env';
import { users } from './schema';
const db = drizzle(env.DATABASE_URL);

export default db;
