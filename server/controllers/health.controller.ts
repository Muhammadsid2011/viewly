import type { Request, Response } from "express";

const healthCheck = async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
};

export { healthCheck };