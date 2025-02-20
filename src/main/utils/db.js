import { Pool } from 'pg';
const connectionString = 'postgresql://postgres.hyqaaakuutzfjvyphlqe:uSujKe1D6EQvkpVo@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';
 
const pool = new Pool({
  connectionString,
});

export default pool;
