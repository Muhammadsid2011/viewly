import mongoose from "mongoose";
import PlaylistRepository from "../repositories/playlist.repository";
import { ApiError } from "../utils/ApiError";

class PlaylistService {
    static async createPlaylist(name: string, description: string, ownerId: mongoose.Types.ObjectId){
        const playlist = await PlaylistRepository.createPlaylist(name, description, ownerId);
        return playlist;
    }
    static async getPlaylistById(id: mongoose.Types.ObjectId){
        const playlist = await PlaylistRepository.findById(id);
        console.log(playlist)
        if(!playlist){
            throw new ApiError(404, "Playlist not found");
        }
        return playlist;
    }
}

export default PlaylistService;