import mongoose from "mongoose";
import PlaylistRepository from "../repositories/playlist.repository";

class PlaylistService {
    static async createPlaylist(name: string, description: string, ownerId: mongoose.Types.ObjectId){
        const playlist = await PlaylistRepository.createPlaylist(name, description, ownerId);
        return playlist;
    }
}

export default PlaylistService;