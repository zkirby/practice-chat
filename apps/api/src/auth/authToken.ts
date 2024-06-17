import jwt, { SignOptions } from "jsonwebtoken";

import { InvalidTokenError } from "../errors";

export const signToken = (payload: object, options?: SignOptions): string =>
  jwt.sign(payload, process.env.JWT_SECRET as any, {
    expiresIn: "180 days",
    ...options,
  });

export const verifyToken = (token: string): { [key: string]: any } => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as any);

    if (
      payload !== null &&
      payload !== undefined &&
      typeof payload === "object" &&
      !Array.isArray(payload)
    ) {
      return payload as { [key: string]: any };
    }
    return {};
  } catch (error) {
    throw new InvalidTokenError();
  }
};
