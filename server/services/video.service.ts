import mongoose from "mongoose";
import { deleteImageOnCloudinary, deleteVideoOnCloudinary, uploadOncloudinary } from "../config/cloudinary";
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
    static updateVideo = async (videoId: mongoose.Types.ObjectId, data: Partial<CreateVideoDto>, thumbnail?: string) => {
        if (!videoId) {
            throw new ApiError(400, "video id is required")
        }
        if (thumbnail) {
            const uploadedThumbnail = await uploadOncloudinary(thumbnail);
            if (!uploadedThumbnail) {
                throw new ApiError(500, "Failed to upload thumbnail");
            }
            data.thumbnail = uploadedThumbnail.url;
        }
        const video = await VideoRepository.updateVideo(videoId, data);
        if (!video) {
            throw new ApiError(404, "video not found")
        }
        return video
    }
    static deleteVideo = async (id: mongoose.Types.ObjectId) => {
        const video = await VideoRepository.deleteVideoById(id)
        if(!video){
            throw new ApiError(404, "Video not found")
        }
        deleteVideoOnCloudinary(video.videoFile as string)
        deleteImageOnCloudinary(video.thumbnail as string)
    }
    static togglePublishStatus = async (id: mongoose.Types.ObjectId) => {
        const publishStatus = await VideoRepository.getIsPublishedStatus(id);
        if (publishStatus === undefined || publishStatus === null) {
            throw new ApiError(404, "Video not found");
        }
        await VideoRepository.setIsPublishedStatus(id, !publishStatus)
    }
}
export default VideoService;