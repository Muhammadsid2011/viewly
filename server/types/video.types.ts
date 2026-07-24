import mongoose from "mongoose";

export interface IVideo{
    _id: mongoose.Types.ObjectId;
    videoFile: string;
    thumbnail: string;
    owner: mongoose.Types.ObjectId;
    title: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}