import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import type { Request } from "express";

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "..", "uploads");

const makeStorage = (prefix: string) =>
  multer.diskStorage({
    destination: async (_req, _file, cb) => {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".png";
      const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".png";
      cb(null, `${prefix}-${Date.now()}${safeExt}`);
    },
  });

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    // reject, do not throw so route can respond with a 400 when req.file is missing
    cb(null, false);
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage: makeStorage("avatar"),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: imageFileFilter,
});

export const logoUpload = multer({
  storage: makeStorage("logo"),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: imageFileFilter,
});

export { uploadDir };
