import type { NextFunction, Request, Response } from "express";
import LikeService from "../services/like.service";
import mongoose from "mongoose";

const toggleVideoLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id;

        const result = await LikeService.toggleVideoLike(
            new mongoose.Types.ObjectId(videoId as string),
            new mongoose.Types.ObjectId(userId as string)
        );

        res.status(200).json({
            success: true,
            message: result.liked ? "Video liked successfully" : "Video unliked successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const toggleCommentLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const result = await LikeService.toggleCommentLike(
            new mongoose.Types.ObjectId(commentId as string),
            new mongoose.Types.ObjectId(userId as string)
        );

        res.status(200).json({
            success: true,
            message: result.liked ? "Comment liked successfully" : "Comment unliked successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const toggleTweetLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { tweetId } = req.params;
        const userId = req.user._id;

        const result = await LikeService.toggleTweetLike(
            new mongoose.Types.ObjectId(tweetId as string),
            new mongoose.Types.ObjectId(userId as string)
        );

        res.status(200).json({
            success: true,
            message: result.liked ? "Tweet liked successfully" : "Tweet unliked successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getLikedVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const videos = await LikeService.getLikedVideos(
            new mongoose.Types.ObjectId(userId as string),
            page ? parseInt(page as string) : undefined,
            limit ? parseInt(limit as string) : undefined
        );

        res.status(200).json({
            success: true,
            message: "Liked videos fetched successfully",
            data: videos
        });
    } catch (error) {
        next(error);
    }
}

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}