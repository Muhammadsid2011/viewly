import { Router } from "express";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createPlaylistSchema } from "../validations/playlist.validation";
import {
    addVideoToPlaylist,
    createPlaylist,
    getPlaylistById,
    getUsersPlaylist
} from "../controllers/playlist.controller";

const router = Router()

router.use(verifyJWT)

router.post("/", validate(createPlaylistSchema), createPlaylist);
router.get("/:playlistId", getPlaylistById);
router.get("/user/:id", getUsersPlaylist);
router.patch("/add-video/:playlistId/:videoId", addVideoToPlaylist)

export default router;