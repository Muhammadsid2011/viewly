import type { NextFunction, Request, Response } from "express";
import SubscriptionService from "../services/subscription.service";

const toggleSubscription = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { channelId } = req.params;
        await SubscriptionService.toggleSubscription(req.user._id,channelId)

        res.status(204).send()
    } catch (error) {   
        next(error)
    }
}

export {
    toggleSubscription
}