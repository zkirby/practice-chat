import { Express } from "express";
import { friends } from "./controllers/threads";
import { Redis } from "./infra/redis";
import { signToken } from "./auth/authToken";

const USER_NAMES = ["zach", "cat", "josh", "bob", "wendy"];

export const attachPrivateRoutes = (app: Express) => {
  app.get("/friends", friends.list);

  app.get("/user", (req, res) => {
    res.setHeader("content-type", "application/json");
    res.status(200).json(req.currentUser);
  });
};

export const attachPublicRoutes = (
  app: Express,
  services: { redis: Redis }
) => {
  const { redis } = services;

  app.get("/auth", async (req, res) => {
    if (req.cookies["chat-user-token"]) {
      res.status(200);
      return;
    }

    const userId = `${Math.round(Math.random() * 1000)}`;
    const userName =
      USER_NAMES[Math.round(Math.random() * USER_NAMES.length)] + userId;

    await redis.set(userId, JSON.stringify({ userId, userName }));

    res.status(200).cookie("chat-user-token", signToken({ sub: userId }), {
      maxAge: 900000,
      httpOnly: true,
    });
  });
};
