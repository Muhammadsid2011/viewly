import mongoose from "mongoose";
import PlaylistRepository from "../repositories/playlist.repository";
import { ApiError } from "../utils/ApiError";

class PlaylistService {
    static createPlaylist(name: string, description: string, owner: mongoose.Types.ObjectId) {
        const playlist = PlaylistRepository.createPlaylist(name, description, owner);
        return playlist;
    }
    static getPlaylistById(id: mongoose.Types.ObjectId) {
        const playlist = PlaylistRepository.findById(id);
        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }
        return playlist;
    }
    static getUsersPlaylist(userId: mongoose.Types.ObjectId) {
        const playlists = PlaylistRepository.getByOwnerId(userId);
        if (!playlists) {
            throw new ApiError(404, "No playlists were found")
        }
        return playlists;
    }
    static addVideoToPlaylist(playlistId: mongoose.Types.ObjectId, videoId: mongoose.Types.ObjectId){
        if(!playlistId || !videoId){
            throw new ApiError(400, "Playlist and video id is required")
        }
        return PlaylistRepository.addVideo(playlistId, videoId)
    }
}

export default PlaylistService;