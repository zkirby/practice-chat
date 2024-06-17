import { createClient } from "redis";

export type Redis = Awaited<ReturnType<typeof initRedis>>;

export const initRedis = async () => {
  return createClient()
    .on("error", (err) => console.log("[REDIS] Client Error", err))
    .connect();
};

export const closeRedis = async (client: Redis) => {
  await client.disconnect();
};
