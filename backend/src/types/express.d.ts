import type { AuthPayload } from "./auth.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      file?: Express.Multer.File;
    }
  }
}

export {};
