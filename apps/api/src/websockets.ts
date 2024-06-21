import http from "http";
import { Redis } from "./infra/redis";
import { Mongo } from "./infra/mongo";
import llm from "./llm";

const CHANNEL_LIVE_CHAT = "livechat";

let _clients: any[] = [];
let _id = 0;

const broadcast = (message: any) =>
  _clients.forEach((s) => s.send(JSON.stringify(message)));

// const subscribeToRedis = async (redis: Redis) => {
//   const subscriber = redis.duplicate();
//   await subscriber.connect();

//   subscriber.subscribe(CHANNEL_LIVE_CHAT, (message) => {
//     broadcast(JSON.parse(message));
//   });
// };

export const attachWebsocket = (
  wss: any,
  server: http.Server,
  services: { redis: Redis; mongo: Mongo }
) => {
  const { redis, mongo } = services;
  // subscribeToRedis(redis);

  wss.on("connection", (socket: any) => {
    _clients.push(socket);
    socket.on("message", async (payload: any) => {
      const prompt = payload.toString();
      const { id, message, name } = JSON.parse(prompt);
      const sentAt = new Date().toISOString();
      console.log(`WSS REQUEST: ${id} ${message.slice(0, 5)}`);

      const messages = await mongo.collection("messages");
      await messages.insertOne({ from: id, text: message, sentAt });

      broadcast({
        user: { id, role: "human", name },
        content: { id: ++_id, text: message },
        sentAt,
      });

      // redis.publish(
      //   CHANNEL_LIVE_CHAT,
      //   JSON.stringify({
      //     user: { id, role: "human", name },
      //     content: { id: ++_id, text: message },
      //     sentAt,
      //   })
      // );

      const cid = ++_id;
      let fullText = "";
      const sentAtLlm = new Date().toISOString();
      await llm.stream(message, (chunk: any) => {
        fullText += chunk;
        broadcast({
          user: { id: 1000, role: "ai", name: "assistant" },
          content: { id: cid, fragment: chunk },
          sentAt,
        });
      });

      await messages.insertOne({ from: id, text: fullText, sentAt: sentAtLlm });
    });
  });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (socket: any) => {
      wss.emit("connection", socket, request);
    });
  });
};
