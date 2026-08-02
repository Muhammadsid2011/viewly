import mongoose from "mongoose";
import Subscription from "../models/subscription.model";

class SubscriptionRepository {
    static subscribe(subscriberId: mongoose.Types.ObjectId, channelId: mongoose.Types.ObjectId) {
        return Subscription.create({
            subscriber: subscriberId,
            channel: channelId,
        });
    }

    static unsubscribe(subscriberId: mongoose.Types.ObjectId, channelId: mongoose.Types.ObjectId) {
        return Subscription.findOneAndDelete({
            subscriber: subscriberId,
            channel: channelId,
        });
    }

    static async isSubscribed(subscriberId: mongoose.Types.ObjectId, channelId: mongoose.Types.ObjectId) {
        const subscription = await Subscription.exists({
            subscriber: subscriberId,
            channel: channelId,
        });

        return !!subscription;
    }
    static getSubscribersCount(channelId: mongoose.Types.ObjectId) {
        return  Subscription.countDocuments({
            channel: channelId,
        });
    }
}

export default SubscriptionRepository;