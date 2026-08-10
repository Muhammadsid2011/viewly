import mongoose from "mongoose";

export interface IVideo{
    _id: mongoose.Types.ObjectId;
    videoFile: string;
    thumbnail: string;
    owner: mongoose.Types.ObjectId;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateVideoDto {
    title: string;
    videoFile: string;
    thumbnail: string;
    duration: number;
    owner: mongoose.Types.ObjectId;
    description: string;
    isPublished?: boolean;
}