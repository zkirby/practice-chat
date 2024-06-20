import { Express } from "express";
import { friends } from "./controllers/threads";
import { Database } from "./infra/database";

const USER_NAMES = ["zach", "cat", "josh", "bob", "wendy"];
const USER_COLORS = ["coral", "bisque", "lightskyblue", "slateblue"];

export const attachPrivateRoutes = (app: Express) => {
  app.get("/friends", friends.list);

  app.get("/me", (req, res) => {
    res
      .status(200)
      .send({ user: { name: req.currentUser.name, id: req.currentUser.id } });
  });
};

export const attachPublicRoutes = (
  app: Express,
  services: { db: Database }
) => {
  const { db } = services;
  app.put("/users", async (req, res) => {
    const { password, username } = req.body;
    let userResp = await db.query(
      `SELECT * FROM users WHERE password='${password}' AND name='${username}'`
    );

    if (!userResp.rows.length) {
      await db.query(
        `INSERT INTO users (name, password) VALUES ('${username}', '${password}')`
      );
      userResp = await db.query(
        `SELECT * FROM users WHERE password='${password}' AND name='${username}'`
      );
    }

    const user = userResp.rows[0];
    res.cookie("chat-user-token", user.id, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).send({ user });
  });
};
