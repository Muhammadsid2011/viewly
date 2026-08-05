import mongoose from "mongoose";
import Tweet from "../models/tweet.model";

class TweetRepository {
    static create(content: string, owner: mongoose.Types.ObjectId){
        return Tweet.create({
            content,
            owner
        })
    }
    static getByOwnerId(ownerId: mongoose.Types.ObjectId){
        return Tweet.find({ owner: ownerId }).populate("owner", "username fullName avatar");
    }
}
export default TweetRepository