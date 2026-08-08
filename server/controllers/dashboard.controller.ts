import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Video from "../models/video.model";
import Subscription from "../models/subscription.model";
import Like from "../models/like.model";
import { ApiError } from "../utils/ApiError";

const getChannelStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const [videoStats, subscriberCount, totalLikes] = await Promise.all([
            Video.aggregate([
                { $match: { owner: userId } },
                {
                    $group: {
                        _id: null,
                        totalVideos: { $sum: 1 },
                        totalViews: { $sum: "$views" },
                    },
                },
            ]),
            Subscription.countDocuments({ channel: userId }),
            Like.aggregate([
                {
                    $lookup: {
                        from: "videos",
                        localField: "video",
                        foreignField: "_id",
                        as: "videoData",
                    },
                },
                { $unwind: "$videoData" },
                { $match: { "videoData.owner": userId } },
                { $count: "totalLikes" },
            ]),
        ]);

        const stats = videoStats[0] || { totalVideos: 0, totalViews: 0 };
        const likes = totalLikes[0] || { totalLikes: 0 };

        res.status(200).json({
            success: true,
            message: "Channel stats fetched successfully",
            data: {
                totalVideos: stats.totalVideos,
                totalViews: stats.totalViews,
                totalSubscribers: subscriberCount,
                totalLikes: likes.totalLikes,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getChannelVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;
        const sortOrder = sortType === "asc" ? 1 : -1;

        const [videos, total] = await Promise.all([
            Video.find({ owner: userId })
                .sort({ [sortBy as string]: sortOrder })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Video.countDocuments({ owner: userId }),
        ]);

        res.status(200).json({
            success: true,
            message: "Channel videos fetched successfully",
            data: {
                videos,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export {
    getChannelStats,
    getChannelVideos,
};