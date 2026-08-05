import TweetRepository from "../repositories/tweet.repository";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

class TweetService {
    static async createTweet(content: string, owner: mongoose.Types.ObjectId) {
        if (!content || !owner) {
            throw new ApiError(400,"Content and owner are required to create a tweet.");
        }
        const tweet = await TweetRepository.create(content, owner);
        return tweet;
    }
    static async getTweetsByOwnerId(ownerId: mongoose.Types.ObjectId) {
        if (!ownerId) {
            throw new ApiError(400,"Owner ID is required to fetch tweets.");
        }
        const tweets = await TweetRepository.getByOwnerId(ownerId);
        return tweets;
    }
}

export default TweetService;