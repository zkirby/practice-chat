import { Express } from "express";
import { friends } from "./controllers/friends";
import { Database } from "./infra/database";
import { users } from "./controllers/users";

export const attachPrivateRoutes = (
  app: Express,
  services: { db: Database }
) => {
  app.get("/friends", friends.list(services));
  app.post("/friends", friends.add(services));
  app.get("/users", users.list(services));

  app.get("/me", (req, res) => {
    const { name, id } = req.currentUser;
    res.status(200).send({ user: { name, id } });
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
