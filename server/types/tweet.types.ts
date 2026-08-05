import mongoose from "mongoose";

export interface ITweet {
    _id: mongoose.Types.ObjectId;
    content: string;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}