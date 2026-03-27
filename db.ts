import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL) {
    console.error("❌ ERRO FATAL: A variável DATABASE_URL não foi encontrada. O arquivo .env está correto?");
} else {
    console.log("✅ Variável de banco de dados encontrada!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("🟢 Conexão com o banco Neon estabelecida com sucesso!"))
  .catch((err) => console.error("🔴 Falha ao conectar no banco Neon. O erro exato é:", err.message));

export const db = drizzle(pool);