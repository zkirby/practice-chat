import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import http from "http";
import cookieParser from "cookie-parser";

import { attachPrivateRoutes, attachPublicRoutes } from "./routes";
import { attachAuth } from "./middleware/authentication";
import { attachSSE } from "./sse";
import { attachWebsocket } from "./websockets";
import { localLog } from "./middleware/localLog";

import { Redis, close as closeRedis, init as initRedis } from "./infra/redis";
import { Database, close as closeDB, init as initDB } from "./infra/database";
import { Mongo, close as closeMongo, init as initMongo } from "./infra/mongo";

const port = process.env.PORT || 5001;

interface Services {
  redis: Redis;
  db: Database;
  mongo: Mongo;
}

const initServer = (services: Services) => {
  const app = express();
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use(localLog);

  attachPublicRoutes(app, services);

  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  attachWebsocket(wss, server, services);
  attachSSE(app);

  attachAuth(app, services);
  app.get("/healthz", (req, res) => res.status(200).send({ success: true }));

  attachPrivateRoutes(app, services);

  server.listen(port, () => console.log("### Server is up and running ###"));
};

async function start() {
  const redis = await initRedis();
  const database = await initDB();
  const { db: mongo, client: mongoClient } = await initMongo();

  initServer({ redis, db: database, mongo });

  process.on("exit", async () => {
    console.log("[SERVER] Closing server");

    console.log("[SERVER] Closing redis");
    await closeRedis(redis);

    console.log("[SERVER] Closing database");
    await closeDB(database);

    console.log("[SERVER] Closing mongo");
    await closeMongo(mongoClient);

    console.log("[SERVER] Server is closed...");
    process.exit();
  });
}

start().catch(console.error);
