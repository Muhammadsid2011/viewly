import { Router } from "express";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createPlaylistSchema } from "../validations/playlist.validation";
import {
    createPlaylist,
    getPlaylistById
} from "../controllers/playlist.controller";

const router = Router()

router.use(verifyJWT)

router.post("/", validate(createPlaylistSchema), createPlaylist);
router.get("/:playlistId", getPlaylistById);

export default router;