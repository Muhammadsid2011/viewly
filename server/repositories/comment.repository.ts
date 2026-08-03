import mongoose, { isValidObjectId, PipelineStage } from "mongoose";
import Comment from "../models/comment.model";
import { ApiError } from "../utils/ApiError";

class CommentRepository{
    static getVideoComments = async (
        videoId: mongoose.Types.ObjectId,
        page?: number,
        limit?: number
    ) => {
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid video id");
        }

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    video: videoId,
                },
            },
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
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$owner",
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ];

        const aggregate = Comment.aggregate(pipeline);

        const options = {
            page: Number(page),
            limit: Number(limit),
        };

        const comments = await (Comment as any).aggregatePaginate(
            aggregate,
            options
        );

        return comments;
    };
}

export default CommentRepository;