import http from "http";
import { Redis } from "./infra/redis";

const CHANNEL_LIVE_CHAT = "livechat";

let _clients: any[] = [];
let _id = 0;

const broadcast = (message: any) =>
  _clients.forEach((s) => s.send(JSON.stringify(message)));

const subscribeToRedis = async (redis: Redis) => {
  const subscriber = redis.duplicate();
  await subscriber.connect();

  subscriber.subscribe(CHANNEL_LIVE_CHAT, (_, message) => {
    broadcast(message);
  });
};

export const attachWebsocket = (
  wss: any,
  server: http.Server,
  services: { redis: Redis }
) => {
  const { redis } = services;
  subscribeToRedis(redis);

  wss.on("connection", (socket: any) => {
    _clients.push(socket);
    socket.on("message", async (payload: any) => {
      const prompt = payload.toString();
      const { id, message } = JSON.parse(prompt);
      console.log(`WSS REQUEST: ${id} ${message.slice(0, 5)}`);

      broadcast({
        user: { id, role: "human" },
        content: { id: ++_id, text: message },
        sentAt: new Date().toISOString(),
      });

      redis.publish(
        CHANNEL_LIVE_CHAT,
        JSON.stringify({
          user: { id, role: "human" },
          content: { id: ++_id, text: message },
          sentAt: new Date().toISOString(),
        })
      );

      // const cid = ++_id;
      // const sentAt = new Date().toISOString();
      // await stream(message, (chunk) => {
      //   broadcast({
      //     user: { id: 1000, role: "ai" },
      //     content: { id: cid, fragment: chunk },
      //     sentAt,
      //   });
      // });
    });
  });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket: any) => {
      wss.emit("connection", socket, request);
    });
  });
};
