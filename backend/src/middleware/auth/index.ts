import jwt from "jsonwebtoken"; // jsonwebtoken is a library used to create and verify JSON Web Tokens (JWTs) for authentication purposes.
import type { NextFunction, Request, Response } from "express"; // these types are imported from the Express library to provide type definitions for the request, response, and next function used in middleware functions.
import type { AuthPayload } from "../../types/auth.ts"; 

const getJwtSecret = (): string => process.env.JWT_SECRET || "dev-secret";

const signToken = (vendor: AuthPayload): string =>
  jwt.sign(
    { id: vendor.id, email: vendor.email, businessName: vendor.businessName },
    getJwtSecret(),
    { expiresIn: "12h" }
  );

  // the authenticate middleware function is responsible for verifying the presence and validity of a JWT in the incoming request's Authorization header. 
  // it checks if the header exists and starts with "Bearer ", then extracts the token and verifies it using the jsonwebtoken library. 
  // if the token is valid, it decodes the payload and attaches it to the request object for use in subsequent middleware or route handlers. 
  // if any step fails (missing header, invalid token, etc.), it responds with a 401 Unauthorized status and an appropriate error message.
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
