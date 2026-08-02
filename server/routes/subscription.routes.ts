import { Router } from "express";
import {
    getTotalSubscribersCount,
    toggleSubscription
} from "../controllers/subscription.controller"
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.use(verifyJWT)

router.post("/toggle/:channelId", toggleSubscription)
router.get("/count/:channelId", getTotalSubscribersCount)

export default router;