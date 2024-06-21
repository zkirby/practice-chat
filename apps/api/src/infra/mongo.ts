import { MongoClient } from "mongodb";
import { config } from "../config";

const url = `mongodb://${config.mongo.user}:${config.mongo.password}@localhost:${config.mongo.port}`;

export type Mongo = Awaited<ReturnType<typeof init>>["db"];
type Client = Awaited<ReturnType<typeof init>>["client"];

async function init() {
  const client = new MongoClient(url);
  await client.connect();
  const db = await client.db("chat");
  return { client, db };
}

async function close(client: Client) {
  client.close();
}

export { init, close };
