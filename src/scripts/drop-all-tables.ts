import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function dropAllTables() {
  const client = await pool.connect();
  
  try {
    console.log("🗑️  Dropando todas as tabelas...");
    
    await client.query(`
      DROP TABLE IF EXISTS "eventos_partida" CASCADE;
      DROP TABLE IF EXISTS "partidas_participacao" CASCADE;
      DROP TABLE IF EXISTS "escalacoes_jogadores" CASCADE;
      DROP TABLE IF EXISTS "escalacoes" CASCADE;
      DROP TABLE IF EXISTS "partidas" CASCADE;
      DROP TABLE IF EXISTS "jogadores" CASCADE;
      DROP TABLE IF EXISTS "times" CASCADE;
      DROP TABLE IF EXISTS "User" CASCADE;
      DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
    `);
    
    console.log("✅ Todas as tabelas foram dropadas!");
  } catch (error) {
    console.error("❌ Erro ao dropar tabelas:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

dropAllTables();
