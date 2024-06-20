import { Express } from "express";

import { InvalidTokenError } from "../errors";
import { Database } from "../infra/database";

export const attachAuth = (app: Express, services: { db: Database }) => {
  const { db } = services;

  app.use("/", async (req, res, next) => {
    const userId = req.cookies["chat-user-token"];
    if (!userId) {
      // throw new InvalidTokenError("Authentication token not found.");
      res.send(401);
      return;
    }

    let user;
    try {
      user = await db.query(`SELECT * FROM users WHERE id=${userId}`);
    } catch {
      res.send(401);
      return;
    }

    if (!user) {
      // throw new InvalidTokenError(
      //   "Authentication token is invalid: User not found."
      // );
      res.send(401);
      return;
    }
    /// @ts-expect-error allow
    req.currentUser = user;
    next();
  });
};
