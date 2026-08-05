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
    static update(tweetId: mongoose.Types.ObjectId,ownerId: mongoose.Types.ObjectId, content: string){
        return Tweet.findByIdAndUpdate({ _id: tweetId, owner: ownerId }, { content }, { new: true }).populate("owner", "username fullName avatar");
    }
    static delete(id: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId){
        return Tweet.findByIdAndDelete({ _id: id, owner: ownerId });
    }
}
export default TweetRepository