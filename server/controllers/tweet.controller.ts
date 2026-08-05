import type { NextFunction, Request, Response } from "express";
import TweetService from "../services/tweet.service";
import mongoose from "mongoose";

const createTweet = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { content } = req.body;
        const owner = req.user._id as string;
        const tweet = await TweetService.createTweet(content, new mongoose.Types.ObjectId(owner));

        return res.status(201).json({
            message: "Tweet created successfully",
            data: tweet
        });
    } catch (error) {
        next(error);
    }
}

const getTweetsByOwnerId = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const ownerId = req.params.ownerId;
        const tweets = await TweetService.getTweetsByOwnerId(new mongoose.Types.ObjectId(ownerId));

        return res.status(200).json({
            message: "Tweets fetched successfully",
            data: tweets
        });
    } catch (error) {
        next(error);
    }
}

export {
    createTweet,
    getTweetsByOwnerId
}