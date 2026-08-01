import mongoose from "mongoose";
import Playlist from "../models/playlist.model";

class PlaylistRepository {
    static createPlaylist(name: string, description: string, owner: mongoose.Types.ObjectId) {
        return Playlist.create({
            name,
            description,
            owner
        });
    }
    static findById(id: mongoose.Types.ObjectId) {
        return Playlist.findById(id).populate("owner", "fullName username avatar");
    }
    static getByOwnerId(id: mongoose.Types.ObjectId) {
        return Playlist.find({
            owner: id
        }).populate("owner", "fullName username avatar")
    }
    static addVideo(id: mongoose.Types.ObjectId, videoId: mongoose.Types.ObjectId) {
        return Playlist.findByIdAndUpdate(
            id,
            {
                $addToSet: { videos: videoId }
            },
            { new: true }
        );
    }
    static removeVideo(id: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId, videoId: mongoose.Types.ObjectId) {
        return Playlist.findOneAndUpdate(
            {
                _id: id,
                owner: ownerId,
            },
            {
                $pull: {
                    videos: new mongoose.Types.ObjectId(videoId),
                },
            },
            {
                new: true,
            }
        );
    }
    static delete(id: mongoose.Types.ObjectId, ownerId: mongoose.Types.ObjectId){
        return Playlist.deleteOne({
            _id: id,
            owner: ownerId
        })
    }
}

export default PlaylistRepository;