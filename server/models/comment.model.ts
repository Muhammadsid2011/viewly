import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IComment } from "../types/comment.types";

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: mongoose.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

const Comment = mongoose.model("Comment", commentSchema)

export default Comment;