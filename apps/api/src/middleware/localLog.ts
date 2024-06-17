import { RequestHandler } from "express";

export const localLog: RequestHandler = async (req, _res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url}`);
  next();
};
