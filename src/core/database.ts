import { createConnection } from "typeorm";
import { types } from "pg";
import { DATABASE_URL, DATABASE_SYNC, DEVELOPMENT } from "../config";

types.setTypeParser(20, BigInt);

export async function createTypeORM(): Promise<void> {
  const connection = await createConnection({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: DATABASE_SYNC,
    logging: DEVELOPMENT,
    entities: ["build/lib/**/*.js"],
    migrations: ["build/migrations/**/*.js"]
  });

  await connection.runMigrations();
}
