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

export {
    getVideosComment
}