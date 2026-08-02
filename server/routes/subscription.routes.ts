import { Router } from "express";
import {
    getTotalSubscribedChannelsCount,
    getTotalSubscribersCount,
    toggleSubscription
} from "../controllers/subscription.controller"
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.use(verifyJWT)

router.post("/toggle/:channelId", toggleSubscription)
router.get("/count-subscribers/:channelId", getTotalSubscribersCount)
router.get("/count-channels/:subscriberId", getTotalSubscribedChannelsCount)

export default router;