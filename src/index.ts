import "reflect-metadata";
import { startServer } from "./core/server";
import { createTypeORM } from "./core/database";

async function main(): Promise<void> {
  await createTypeORM();
  await startServer();
}

// call the main function
main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
