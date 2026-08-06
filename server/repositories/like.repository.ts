import mongoose, { isValidObjectId, PipelineStage } from "mongoose";
import Like from "../models/like.model";
import Video from "../models/video.model";
import { ApiError } from "../utils/ApiError";

class LikeRepository {
    static toggleVideoLike = async (videoId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid video id");
        }

        const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return { liked: false };
        }

        await Like.create({ video: videoId, likedBy: userId });
        return { liked: true };
    }

    static toggleCommentLike = async (commentId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid comment id");
        }

        const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return { liked: false };
        }

        await Like.create({ comment: commentId, likedBy: userId });
        return { liked: true };
    }

    static toggleTweetLike = async (tweetId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) => {
        if (!isValidObjectId(tweetId)) {
            throw new ApiError(400, "Invalid tweet id");
        }

        const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return { liked: false };
        }

        await Like.create({ tweet: tweetId, likedBy: userId });
        return { liked: true };
    }

    static getLikedVideos = async (userId: mongoose.Types.ObjectId, page?: number, limit?: number) => {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id");
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    likedBy: userId,
                    video: { $exists: true, $ne: null }
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $unwind: "$owner"
                        },
                        {
                            $project: {
                                videoFile: 1,
                                thumbnail: 1,
                                owner: 1,
                                title: 1,
                                duration: 1,
                                views: 1,
                                isPublished: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$video"
            },
            {
                $replaceRoot: { newRoot: "$video" }
            },
            {
                $sort: { createdAt: -1 }
            }
        ];

        const aggregate = Like.aggregate(pipeline);

        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10
        };

        const videos = await (Like as any).aggregatePaginate(aggregate, options);
        return videos;
    }
}

export default LikeRepository;