import type { NextFunction, Request, Response } from "express";
import CommentService from "../services/comment.service";
import mongoose from "mongoose";

const getVideosComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.params;
        const { page = 1, limit = 10 } = req.query

        const comments = await CommentService.getVideosComment(new mongoose.Types.ObjectId(videoId as string), page as number, limit as number)

        return res.send(200).json({
            message: "comments fetched succsessfully",
            data: comments
        })
    } catch (error) {
        next(error)
    }
}

const addComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { content, video, } = req.body;
        const id = req.user._id as string;

        const comment = await CommentService.addComment({
            content,
            video
        }, new mongoose.Types.ObjectId(id))
    } catch (error) {
        next(error)
    }
}

const updateComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body;
        const { commentId } = req.params;
        const comment = await CommentService.updateComment({ content }, new mongoose.Types.ObjectId(commentId))

        return res.status(200).json({
            message: "Comment updated successfully",
            data: comment
        })
    } catch (error) {
        next(error)
    }
}

export {
    getVideosComment,
    addComment,
    updateComment
}