import pg from "pg";
import { config } from "../config";

export type Database = Awaited<ReturnType<typeof init>>;

const init = async () => {
  const client = new pg.Client({
    user: config.postgres.user,
    host: config.postgres.host,
    database: config.postgres.database,
    password: config.postgres.password,
    port: config.postgres.port,
  });
  await client.connect();
  return client;
};

const close = async (client: Database) => {
  await client.end();
};

export { init, close };
