import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import { attachPrivateRoutes } from "./routes";
import { authenticateUser } from "./middleware/authentication";
import { attachSSE } from "./sse";
import { attachWebsocket } from "./websockets";
import { localLog } from "./middleware/localLog";
import { Redis, closeRedis, initRedis } from "./infra/redis";

const port = process.env.PORT || 5001;

interface Services {
  redis: Redis;
}

const initServer = (services: Services) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(localLog);

  // TODO: set up auth
  // app.use("/", authenticateUser);
  app.get("/healthz", (req, res) => res.status(200).send({ success: true }));
  attachPrivateRoutes(app);
  attachSSE(app);

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  attachWebsocket(wss, server, services);

  server.listen(port, () => console.log("### Server is up and running ###"));
};

async function start() {
  const redis = await initRedis();

  initServer({ redis });

  process.on("exit", async () => {
    console.log("[SERVER] Closing server");
    console.log("[SERVER] Closing redis");

    await closeRedis(redis);

    console.log("[SERVER] Server is closed...");
    process.exit();
  });
}

start().catch(console.error);
