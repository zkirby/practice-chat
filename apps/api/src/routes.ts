import { Express } from "express";
import { friends } from "./controllers/threads";
import { Redis } from "./infra/redis";
import { signToken } from "./auth/authToken";
import { random } from "./helpers";

const USER_NAMES = ["zach", "cat", "josh", "bob", "wendy"];
const USER_COLORS = ["coral", "bisque", "lightskyblue", "slateblue"];

export const attachPrivateRoutes = (app: Express) => {
  app.get("/friends", friends.list);

  app.get("/user", (req, res) => {
    res.status(200).send({ user: req.currentUser });
  });
};

export const attachPublicRoutes = (
  app: Express,
  services: { redis: Redis }
) => {
  const { redis } = services;

  app.get("/auth", async (req, res) => {
    if (req.cookies["chat-user-token"]) {
      res.status(200).send({ success: true });
      return;
    }

    const userId = `${Math.round(Math.random() * 1000)}`;
    const name = random(USER_NAMES) + userId;
    const color = random(USER_COLORS);

    await redis.set(userId, JSON.stringify({ userId, name, color }));

    res.cookie("chat-user-token", userId, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).send({ success: true });
  });
};
