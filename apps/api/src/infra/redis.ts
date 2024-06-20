import { createClient } from "redis";

export type Redis = Awaited<ReturnType<typeof init>>;

const init = async () => {
  return createClient()
    .on("error", (err) => console.log("[REDIS] Client Error", err))
    .connect();
};

const close = async (client: Redis) => {
  await client.disconnect();
};

export { init, close };
