import mongoose from "mongoose";
import CommentRepository from "../repositories/comment.repository";
import { ApiError } from "../utils/ApiError";
import { createCommentDto } from "../types/comment.types";

class CommentService {
    static async getVideosComment(videoId: mongoose.Types.ObjectId, page?: number, limit?: number) {
        if(!videoId){
            throw new ApiError(400, "VideoId is required")
        }
        const comments = await CommentRepository.getVideoComments(videoId, page, limit)

        return comments
    }
    static async addComment(data: createCommentDto, owner: mongoose.Types.ObjectId){
        const comment = await CommentRepository.create(data, owner)
        return comment;
    }
    static async updateComment(data: Partial<createCommentDto>, commentId: mongoose.Types.ObjectId){
        const comment = await CommentRepository.update(data, commentId)
        return comment;
    }
}

export default CommentService