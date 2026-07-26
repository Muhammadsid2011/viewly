import mongoose from "mongoose";
import { uploadOncloudinary } from "../config/cloudinary";
import VideoRepository from "../repositories/video.repository";
import { CreateVideoDto } from "../types/video.types";
import { ApiError } from "../utils/ApiError";

class VideoService {
    static getAllVideos = async (query?: string, userId?: string, page?: number, limit?: number, sortBy?: string, sortType?: "asc" | "desc") => {
        const videos = await VideoRepository.getAllVideos(query, userId, page, limit, sortBy, sortType);
        return videos;
    }
    static publishVideo = async (data: CreateVideoDto, userId: string) => {
        const existingVideo = await VideoRepository.findByTitle(data.title);
        if (existingVideo) {
            throw new ApiError(400, "Video with this title already exists");
        }

        const videoFile = await uploadOncloudinary(data.videoFile);
        const thumbnail = await uploadOncloudinary(data.thumbnail);

        if (!videoFile || !thumbnail) {
            throw new ApiError(500, "Failed to upload video or thumbnail");
        }

        data.videoFile = videoFile?.url;
        data.thumbnail = thumbnail?.url;
        data.duration = Number(videoFile.duration);

        const video = await VideoRepository.createVideo({
            ...data,
            owner: new mongoose.Types.ObjectId(userId),
        });

        return video;
    }

    static getVIdeoById = async (videoId: mongoose.Types.ObjectId) => {
        if (!videoId) {
            throw new ApiError(400, "video id is required")
        }
        const video = await VideoRepository.findById(videoId);
        if (!video) {
            throw new ApiError(404, "video not found")
        }
        return video
    }
}
export default VideoService;