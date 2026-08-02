import mongoose from "mongoose";
import SubscriptionRepository from "../repositories/subscription.repository";
import { ApiError } from "../utils/ApiError";

class SubscriptionService {
    static async toggleSubscription(subscriber: mongoose.Types.ObjectId, channel: mongoose.Types.ObjectId){
        const isSubscribed = await SubscriptionRepository.isSubscribed(subscriber, channel);
        if(!isSubscribed){
            return await SubscriptionRepository.subscribe(subscriber, channel);
        }
        return await SubscriptionRepository.unsubscribe(subscriber, channel)
    }
    static async getTotalSubscribersCount(channelId: mongoose.Types.ObjectId){
        if(!channelId){
            throw new ApiError(400, "channel id is required")
        }
        const count = await SubscriptionRepository.getSubscribersCount(channelId)
        return count;
    }
}

export default SubscriptionService