import mongoose from "mongoose";

export interface ILike {
    _id: mongoose.Types.ObjectId;
    video: mongoose.Types.ObjectId;
    comment: mongoose.Types.ObjectId
    tweet: mongoose.Types.ObjectId;
    likedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}