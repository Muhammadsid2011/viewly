import { Router } from "express";
import {
    addComment,
    deleteComment,
    getVideosComment,
    updateComment
} from "../controllers/comment.controller";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCommentSchema, updateCommentSchema } from "../validations/comment.validation";

const router = Router();

router.use(verifyJWT)

router.get("/:videoId", getVideosComment);
router.post("/", validate(createCommentSchema), addComment);
router.patch("/update/:commentId", validate(updateCommentSchema), updateComment);
router.delete("/delete/:commentId", deleteComment);

export default router;