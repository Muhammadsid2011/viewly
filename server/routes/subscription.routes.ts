import { Router } from "express";
import {
    toggleSubscription
} from "../controllers/subscription.controller"
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.use(verifyJWT)

router.post("/toggel/:channelId", toggleSubscription)

export default router;