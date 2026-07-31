import mongoose from "mongoose";
import Playlist from "../models/playlist.model";

class PlaylistRepository{
    static createPlaylist(name: string, description: string, ownerId: mongoose.Types.ObjectId){
        return Playlist.create({
            name,
            description,
            owner: ownerId
        })
    }
}

export default PlaylistRepository;