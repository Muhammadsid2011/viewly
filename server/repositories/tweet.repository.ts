import mongoose from "mongoose";
import Tweet from "../models/tweet.model";

class TweetRepository {
    static create(content: string, owner: mongoose.Types.ObjectId){
        return Tweet.create({
            content,
            owner
        })
    }
}
export default TweetRepository