import { Express } from "express";
import { friends } from "./controllers/threads";

export const attachPrivateRoutes = (app: Express) => {
  app.get("/friends", friends.list);
};
