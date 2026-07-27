import type { NextFunction, Request, Response } from "express";
import VideoService from "../services/video.service";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

const getAllVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            query = "",
            userId,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortType = "desc" } = req.query;
        const videos = await VideoService.getAllVideos(
            query as string,
            userId as string,
            page ? parseInt(page as string) : undefined,
            limit ? parseInt(limit as string) : undefined,
            sortBy as string,
            sortType as "asc" | "desc"
        );
        res.status(200).json({
            success: true,
            message: "Videos fetched successfully",
            data: videos,
        });
    } catch (error) {
        next(error);
    }
}

const publishVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        let videoData = req.body;
        const videoFile = req.files?.videoFile?.[0];
        const thumbnail = req.files?.thumbnail?.[0];

        if (!videoFile || !thumbnail) {
            throw new ApiError(400, "Video file and thumbnail are required");
        }

        videoData.videoFile = videoFile.path;
        videoData.thumbnail = thumbnail.path;

        const video = await VideoService.publishVideo(videoData, req.user._id.toString());
        res.status(201).json({
            success: true,
            message: "Video published successfully",
            data: video,
        });
    } catch (error) {
        next(error);
    }
}

const getVideoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const videoId = new mongoose.Types.ObjectId(id as string);

        const video = await VideoService.getVIdeoById(videoId);
        res.status(200).json({
            success: true,
            message: "Video fetched successfully",
            data: video,
        });
    } catch (error) {
        next(error);
    }
}

const updateVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const videoId = new mongoose.Types.ObjectId(id as string);
        const videoData = req.body;
        const thumbnail = req.files?.thumbnail?.[0];
        const video = await VideoService.updateVideo(videoId, videoData, thumbnail ? thumbnail.path : undefined);
        res.status(200).json({
            success: true,
            message: "Video updated successfully",
            data: video,
        });
    } catch (error) {
        next(error);
    }
}

const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        await VideoService.deleteVideo(new mongoose.Types.ObjectId(id as string));
        return res.status(200).json({
            message: "Video deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo
}