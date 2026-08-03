import mongoose from "mongoose";

export interface IComment{
    _id: mongoose.Types.ObjectId;
    content: string;
    video: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
}