import { Express } from "express";

import { verifyToken } from "../auth/authToken";
import { InvalidTokenError } from "../errors";
import { Redis } from "../infra/redis";

export const attachAuth = (app: Express, services: { redis: Redis }) => {
  const { redis } = services;

  app.use("/", async (req, _res, next) => {
    const token = req.cookies["chat-user-token"];
    if (!token) {
      throw new InvalidTokenError("Authentication token not found.");
    }
    const userId = verifyToken(token).sub;
    if (!userId) {
      throw new InvalidTokenError("Authentication token is invalid.");
    }
    const user = await redis.get(userId);

    if (!user) {
      throw new InvalidTokenError(
        "Authentication token is invalid: User not found."
      );
    }
    /// @ts-expect-error allow
    req.currentUser = JSON.parse(user);
    next();
  });
};
