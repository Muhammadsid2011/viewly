import TweetRepository from "../repositories/tweet.repository";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

class TweetService {
    static async createTweet(content: string, owner: mongoose.Types.ObjectId) {
        if (!content || !owner) {
            throw new ApiError(400, "Content and owner are required to create a tweet.");
        }
        const tweet = await TweetRepository.create(content, owner);
        return tweet;
    }
    static async getTweetsByOwnerId(ownerId: mongoose.Types.ObjectId) {
        if (!ownerId) {
            throw new ApiError(400, "Owner ID is required to fetch tweets.");
        }
        const tweets = await TweetRepository.getByOwnerId(ownerId);
        return tweets;
    }
    static async updateTweet(tweetId: mongoose.Types.ObjectId, content: string) {
        if (!tweetId || !content) {
            throw new ApiError(400, "Tweet ID and content are required to update a tweet.");
        }
        const tweet = await TweetRepository.update(tweetId, content);
        if (!tweet) {
            throw new ApiError(404, "Tweet not found.");
        }
        return tweet;
    }
    static async deleteTweet(tweetId: mongoose.Types.ObjectId) {
        if (!tweetId) {
            throw new ApiError(400, "Tweet ID is required to delete a tweet.");
        }
        const result = await TweetRepository.delete(tweetId);
        if (!result) {
            throw new ApiError(404, "Tweet not found.");
        }
        return result;
    }
}

export default TweetService;