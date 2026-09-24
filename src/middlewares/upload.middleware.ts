import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { env } from "../config/env";

const dir = path.resolve(process.cwd(), env.uploadsDir);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, nombre);
  },
});

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);

export const uploadImagen = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (!TIPOS_PERMITIDOS.has(file.mimetype)) {
      cb(new Error("Solo se permiten imágenes JPG, PNG o WebP."));
      return;
    }
    cb(null, true);
  },
}).single("file");
