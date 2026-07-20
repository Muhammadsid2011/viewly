import multer, { StorageEngine } from "multer";
import { Request } from "express";

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: any,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "./public/temp");
  },

  filename: (
    req: Request,
    file: any,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});