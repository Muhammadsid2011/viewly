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

export {
    createPlaylist,
    getPlaylistById
}