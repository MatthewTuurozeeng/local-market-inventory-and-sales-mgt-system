import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { AuthPayload } from "../../types/auth.ts";

const getJwtSecret = (): string => process.env.JWT_SECRET || "dev-secret";

const signToken = (vendor: AuthPayload): string =>
  jwt.sign(
    { id: vendor.id, email: vendor.email, businessName: vendor.businessName },
    getJwtSecret(),
    { expiresIn: "12h" }
  );

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing auth token" });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded !== "object" || decoded === null) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const payload = decoded as AuthPayload;
    if (!payload.id || !payload.email || !payload.businessName) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { signToken, authenticate };
