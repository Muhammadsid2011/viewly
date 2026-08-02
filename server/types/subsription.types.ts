import mongoose from "mongoose";

export interface ISubscription{
    _id: mongoose.Types.ObjectId;
    subscriber: mongoose.Types.ObjectId;
    channel: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}