import db from '@/db/index';
import { users } from '@/db/schema';

export default async function Page() {
  // 2. But if you never call a function from db here,
  // sometimes the bundler delays execution in dev mode.
  return <div>Check Terminal</div>;
}
