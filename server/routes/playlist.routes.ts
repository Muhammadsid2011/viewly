import { Router } from "express";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createPlaylistSchema } from "../validations/playlist.validation";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUsersPlaylist,
    removeVideoFromPlaylist
} from "../controllers/playlist.controller";

const router = Router()

router.use(verifyJWT)

router.post("/", validate(createPlaylistSchema), createPlaylist);
router.get("/:playlistId", getPlaylistById);
router.get("/user/:id", getUsersPlaylist);
router.patch("/add-video/:playlistId/:videoId", addVideoToPlaylist)
router.delete("/remove-video/:playlistId/:videoId", removeVideoFromPlaylist)
router.delete("/:id", deletePlaylist)

export default router;