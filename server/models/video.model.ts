import mongoose, { Schema, Model } from "mongoose";
import { IVideo } from "../types/video.types";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema<IVideo>({
    videoFile: {
        type: String, // cloudinary URL
        required: true
    },
    thumbnail: {
        type: String, // cloudinary URL
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)

const Video: Model<IVideo> = mongoose.model("Video", videoSchema)

export default Video;