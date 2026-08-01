import mongoose from "mongoose";

export interface IPlaylist{
    name: string;
    description: string;
    videos: mongoose.Types.ObjectId[];
    owner: mongoose.Types.ObjectId;
}
export interface CreatePlaylistDto{
    name: string;
    description: string
}