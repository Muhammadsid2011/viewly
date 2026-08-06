import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller";
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.get("/stats", verifyJWT, getChannelStats);
router.get("/videos", verifyJWT, getChannelVideos);

export default router;