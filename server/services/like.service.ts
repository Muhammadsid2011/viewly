import mongoose from "mongoose";
import LikeRepository from "../repositories/like.repository";
import { ApiError } from "../utils/ApiError";

class LikeService {
    static toggleVideoLike = async (videoId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (!videoId || !userId) {
            throw new ApiError(400, "Video ID and User ID are required");
        }
        return LikeRepository.toggleVideoLike(videoId, userId);
    }

    static toggleCommentLike = async (commentId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (!commentId || !userId) {
            throw new ApiError(400, "Comment ID and User ID are required");
        }
        return LikeRepository.toggleCommentLike(commentId, userId);
    }

    static toggleTweetLike = async (tweetId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (!tweetId || !userId) {
            throw new ApiError(400, "Tweet ID and User ID are required");
        }
        return LikeRepository.toggleTweetLike(tweetId, userId);
    }

    static getLikedVideos = async (userId: mongoose.Types.ObjectId, page?: number, limit?: number) => {
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }
        return LikeRepository.getLikedVideos(userId, page, limit);
    }
}

export default LikeService;