import { Router } from "express";
import {
    getVideosComment
} from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.use(verifyJWT)

router.get("/", getVideosComment)