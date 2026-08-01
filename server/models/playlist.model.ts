import mongoose, { Schema } from "mongoose";
import { IPlaylist } from "../types/playlist.types";

const playlistSchema = new Schema<IPlaylist>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    videos: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Video"
        }
    ]
})

const Playlist = mongoose.model("playlist", playlistSchema);

export default Playlist;