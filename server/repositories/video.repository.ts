import mongoose, { isValidObjectId, PipelineStage } from "mongoose";
import Video from "../models/video.model";
import { ApiError } from "../utils/ApiError";
import { CreateVideoDto, IVideo } from "../types/video.types";

class VideoRepository {
    static findByTitle = async (title: string) => {
        const video = await Video.findOne({ title });
        return video;
    }
    static getAllVideos = async (query?: string, userId?: string, page?: number, limit?: number, sortBy?: string, sortType?: "asc" | "desc") => {
        const matchStage: Record<string, unknown> = {
            isPublished: true,
        };

        // Search by title
        if (query) {
            matchStage.$or = [
                {
                    title: {
                        $regex: query as string,
                        $options: "i",
                    },
                    description: {
                        $regex: query as string,
                        $options: "i",
                    }
                }
            ];
        }

        // Filter by owner
        if (userId) {
            if (!isValidObjectId(userId as string)) {
                throw new ApiError(400, "Invalid user id");
            }

            matchStage.owner = new mongoose.Types.ObjectId(userId as string);
        }

        const pipeline: PipelineStage[] = [
            {
                $match: matchStage,
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
                    [sortBy as string]: sortType === "asc" ? 1 : -1,
                },
            },
        ];

        const aggregate = Video.aggregate(pipeline);

        const options = {
            page: Number(page),
            limit: Number(limit),
        };

        const videos = await (Video as any).aggregatePaginate(
            aggregate,
            options
        );
        return videos;
    }
    static createVideo = async (data: CreateVideoDto) => {
        const video = await Video.create(data);
        return video;
    }
    static findById = async (id: mongoose.Types.ObjectId) => {
        const video = await Video.findById(id).populate("owner", "fullName username avatar");
        return video;
    }
    static updateVideo = async (id: mongoose.Types.ObjectId, data: Partial<IVideo>) => {
        const video = await Video.findByIdAndUpdate(id, data, { new: true }).populate("owner", "fullName username avatar");
        return video;
    }
    static deleteVideoById = async (id: mongoose.Types.ObjectId) => {
        const video = await Video.findByIdAndDelete(id);
        return video;
    }
    static getIsPublishedStatus = async (id: mongoose.Types.ObjectId): Promise<boolean> => {
        const video = await Video.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $project: {
                    isPublished: 1
                }
            }
        ]);
        return video[0]?.isPublished;
    }
    static setIsPublishedStatus = async (id: mongoose.Types.ObjectId, publishStatus: boolean) => {
        await Video.findByIdAndUpdate(id, {
            $set: {
                isPublished: publishStatus
            }
        },
            { new: true }
        );
    }
    static incrementViews = async (id: mongoose.Types.ObjectId) => {
        const video = await Video.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );
        return video;
    }
}
export default VideoRepository;