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
        const { ownerId } = req.params;
        const tweets = await TweetService.getTweetsByOwnerId(new mongoose.Types.ObjectId(ownerId as string));

        return res.status(200).json({
            message: "Tweets fetched successfully",
            data: tweets
        });
    } catch (error) {
        next(error);
    }
}

const updateTweet = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { tweetId } = req.params;
        const { content } = req.body;
        const updatedTweet = await TweetService.updateTweet(new mongoose.Types.ObjectId(tweetId as string), content);

        return res.status(200).json({
            message: "Tweet updated successfully",
            data: updatedTweet
        });
    } catch (error) {
        next(error);
    }
}

export {
    createTweet,
    getTweetsByOwnerId
}