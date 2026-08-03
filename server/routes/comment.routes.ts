import { Router } from "express";
import {
    addComment,
    getVideosComment
} from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCommentSchema } from "../validations/comment.validation";

const router = Router();

router.use(verifyJWT)

router.get("/", getVideosComment);
router.post("/", validate(createCommentSchema), addComment)

export default router;