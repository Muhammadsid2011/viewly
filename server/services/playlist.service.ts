import mongoose from "mongoose";
import PlaylistRepository from "../repositories/playlist.repository";
import { ApiError } from "../utils/ApiError";
import { CreatePlaylistDto } from "../types/playlist.types";

class PlaylistService {
    static createPlaylist(data: CreatePlaylistDto, owner: mongoose.Types.ObjectId) {
        const playlist = PlaylistRepository.createPlaylist(data.name, data.description, owner);
        return playlist;
    }
    static async getPlaylistById(id: mongoose.Types.ObjectId) {
        const playlist = await PlaylistRepository.findById(id);
        if (!playlist) {
            throw new ApiError(404, "Playlist not found");
        }
        return playlist;
    }
    static async getUsersPlaylist(userId: mongoose.Types.ObjectId) {
        const playlists = await PlaylistRepository.getByOwnerId(userId);
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
    static removeVideoFromPlaylist(id: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId, videoId: mongoose.Types.ObjectId){
        if(!id || !ownerId || !videoId){
            throw new ApiError(400, "Insufficient arguments")
        }
        return PlaylistRepository.removeVideo(id, ownerId, videoId)
    }
    static deletePlaylist(id: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId){
        if(!id || !ownerId){
            throw new ApiError(400, "Insufficient arguments")
        }
        return PlaylistRepository.delete(id, ownerId)
    }
    static async updatePlaylist(id: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId, data: Partial<CreatePlaylistDto>){
        if(!id || !ownerId){
             throw new ApiError(400, "Insufficient arguments")
        }
        const playlist = await PlaylistRepository.update(id,ownerId,data.name, data.description);
        if(!playlist){
            throw new ApiError(404, "Playlist not found")
        }
        return playlist
    }
}

export default PlaylistService;