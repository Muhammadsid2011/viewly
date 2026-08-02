import mongoose from "mongoose";
import SubscriptionRepository from "../repositories/subscription.repository";

class SubscriptionService {
    static async toggleSubscription(subscriber: mongoose.Types.ObjectId, channel: mongoose.Types.ObjectId){
        const isSubscribed = await SubscriptionRepository.isSubscribed(subscriber, channel);
        if(!isSubscribed){
            return await SubscriptionRepository.subscribe(subscriber, channel);
        }
        return await SubscriptionRepository.unsubscribe(subscriber, channel)
    }
}

export default SubscriptionService