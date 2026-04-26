import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    console.log('Altering categories table image column to jsonb...');
    await sql`
      ALTER TABLE categories 
      ALTER COLUMN image TYPE jsonb 
      USING image::jsonb;
    `;
    console.log('Success!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
