import type { NextFunction, Request, Response } from "express";
import PlaylistService from "../services/playlist.service";
import mongoose from "mongoose";

const createPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const playlist = await PlaylistService.createPlaylist(req.body, req.user._id);

        return res.status(201).json({
            message: "PlayList created successfully",
            data: playlist
        })
    } catch (error) {
        next(error)
    }
}

const getPlaylistById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playlistId } = req.params;
        const playlist = await PlaylistService.getPlaylistById(new mongoose.Types.ObjectId(playlistId as string));

        return res.status(200).json({
            message: "playlist fetched successfully",
            data: playlist
        })
    } catch (error) {
        next(error)
    }
}

const getUsersPlaylist = async (req: Request, res: Response, next: NextFunction) => {
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

const addVideoToPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playlistId, videoId } = req.params
        await PlaylistService.addVideoToPlaylist(new mongoose.Types.ObjectId(playlistId as string), new mongoose.Types.ObjectId(videoId as string))

        return res.status(204).send()
    } catch (error) {
        next(error)
    }
}

const removeVideoFromPlaylist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { playlistId, videoId } = req.params;
        await PlaylistService.removeVideoFromPlaylist(new mongoose.Types.ObjectId(playlistId as string), new mongoose.Types.ObjectId(req.user._id), new mongoose.Types.ObjectId(videoId as string))

        return res.status(204).send()
    } catch (error) {
        next(error)
    }
}

const deletePlaylist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await PlaylistService.deletePlaylist(new mongoose.Types.ObjectId(id as string), new mongoose.Types.ObjectId(req.user._id));

        return res.status(204).send()
    } catch (error) {
        next(error)
    }
}
const updatePlaylist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const playlist = await PlaylistService.updatePlaylist(new mongoose.Types.ObjectId(id as string), new mongoose.Types.ObjectId(req.user._id), req.body)

        res.status(200).json({
            message: "playlist updated successfully",
            data: playlist
        })
    } catch (error) {
        next(error)
    }
}

export {
    createPlaylist,
    getPlaylistById,
    getUsersPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}