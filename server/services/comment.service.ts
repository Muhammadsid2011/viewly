import mongoose from "mongoose";
import CommentRepository from "../repositories/comment.repository";
import { ApiError } from "../utils/ApiError";

class CommentService {
    static async getVideosComment(videoId: mongoose.Types.ObjectId, page?: number, limit?: number) {
        if(!videoId){
            throw new ApiError(400, "VideoId is required")
        }
        const comments = await CommentRepository.getVideoComments(videoId, page, limit)

        return comments
    }
}

export default CommentService