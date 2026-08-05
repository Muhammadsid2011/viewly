import mongoose, {Schema} from "mongoose";
import { ITweet } from "../types/tweet.types";

const tweetSchema = new Schema<ITweet>({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


const Tweet = mongoose.model("Tweet", tweetSchema);
export default Tweet;