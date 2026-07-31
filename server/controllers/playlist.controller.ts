import type { NextFunction, Request, Response } from "express";
import PlaylistService from "../services/playlist.service";
import mongoose from "mongoose";

const createPlaylist = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;
        const playlist = await PlaylistService.createPlaylist(name, description, req.user._id);
        return res.status(201).json({
            message: "PlayList created successfully",
            data: playlist
        })
    } catch (error) {
        next(error)
    }
}

const getPlaylistById = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { playlistId } = req.params;
        const playlist = await PlaylistService.getPlaylistById(new mongoose.Types.ObjectId(playlistId));
        return res.status(200).json({
            message: "playlist fetched successfully",
            data: playlist
        })
    } catch (error) {
        next(error)
    }
}

const getUsersPlaylist = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const playlists = await PlaylistService.getUsersPlaylist(new mongoose.Types.ObjectId(req.user._id));
        return res.status(200).json({
            message: "playlists fetched successfully",
            data: playlists
        });
    } catch (error) {
        next(error)
    }
}

const addVideoToPlaylist = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const {playlistId, videoId} = req.params
        await PlaylistService.addVideoToPlaylist(new mongoose.Types.ObjectId(playlistId),new mongoose.Types.ObjectId(videoId))
        return res.status(204).json({})
    } catch (error) {
        next(error)
    }
}

export {
    createPlaylist,
    getPlaylistById,
    getUsersPlaylist,
    addVideoToPlaylist
}