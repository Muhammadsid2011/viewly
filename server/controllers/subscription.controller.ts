import type { NextFunction, Request, Response } from "express";
import SubscriptionService from "../services/subscription.service";
import mongoose from "mongoose";

const toggleSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { channelId } = req.params;
        await SubscriptionService.toggleSubscription(req.user._id, new mongoose.Types.ObjectId(channelId as string))

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
const getTotalSubscribersCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { channelId } = req.params;
        const count = await SubscriptionService.getTotalSubscribersCount(new mongoose.Types.ObjectId(channelId as string))

        res.status(200).json({
            count
        })
    } catch (error) {
        next(error)
    }
}

const getTotalSubscribedChannelsCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { subscriberId } = req.params;
        const count = await SubscriptionService.getTotalSubscribedChannelsCount(new mongoose.Types.ObjectId(subscriberId as string))
        
        res.status(200).json({
            count
        })
   } catch (error) {
        next(error)
   } 
}

export {
    toggleSubscription,
    getTotalSubscribersCount,
    getTotalSubscribedChannelsCount
}