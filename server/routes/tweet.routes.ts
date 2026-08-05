import Router from "express";
import {
    createTweet,
    getTweetsByOwnerId,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller";
import { verifyJWT } from "../middlewares/user.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTweetSchema } from "../validations/tweet.validation";

const router = Router();

router.use(verifyJWT)

router.post("/",validate(createTweetSchema), createTweet);
router.get("/:ownerId", getTweetsByOwnerId);
router.patch("/:tweetId", updateTweet);
router.delete("/:tweetId", deleteTweet);

export default router;