import { Router } from "express";
import {
    getAllVideos,
    publishVideo
} from "../controllers/video.controller";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createVideoSchema } from "../validations/video.validation";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/", verifyJWT, getAllVideos);
router.post("/publish", verifyJWT,upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]), validate(createVideoSchema), publishVideo)

export default router;