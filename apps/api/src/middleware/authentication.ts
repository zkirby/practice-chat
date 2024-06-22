import { Express } from "express";
import jwt from "jsonwebtoken";

import { Database } from "../infra/database";
import { config } from "../config";

export const attachAuth = (app: Express, services: { db: Database }) => {
  const { db } = services;

  app.use("/", async (req, res, next) => {
    const token = getToken(req.headers["authorization"]);
    if (!token) {
      // throw new InvalidTokenError("Authentication token not found.");
      res.sendStatus(401);
      return;
    }

    let userId;
    jwt.verify(token, config.jwt.secret!, (_, user) => {
      userId = (user as any)?.userId;
    });

    let user;
    try {
      const userResp = await db.query(`SELECT * FROM users WHERE id=${userId}`);
      user = userResp.rows[0];
    } catch {
      res.sendStatus(401);
      return;
    }

    if (!user) {
      // throw new InvalidTokenError(
      //   "Authentication token is invalid: User not found."
      // );
      res.sendStatus(401);
      return;
    }
    /// @ts-expect-error allow
    req.currentUser = user;
    next();
  });
};

const getToken = (s: string | string[] | undefined) => {
  if (!s) return null;
  const t = Array.isArray(s) ? s[0] : s;
  return t.split(" ")[1];
};
