import type { NextFunction, Request, Response } from "express";
import PlaylistService from "../services/playlist.service";

const createPlaylist = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const {name, description} = req.body;
        const playlist = await PlaylistService.createPlaylist(name, description, req.user._id);
        return res.status(201).json({
            message: "PlayList created successfully",
            data: playlist
        })
    } catch (error) {
        next(error)
    }
}

export {
    createPlaylist
}