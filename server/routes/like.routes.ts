import { Router } from "express";
import {    
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller";
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.use(verifyJWT);

router.post("/video/:videoId", toggleVideoLike);
router.post("/comment/:commentId", toggleCommentLike);
router.post("/tweet/:tweetId", toggleTweetLike);
router.get("/videos", getLikedVideos);

export default router;