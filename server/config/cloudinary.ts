import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "./env";
import getPublicId from "../utils/getPublicId";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})

export const uploadOncloudinary = async (localPath: string) => {
    try {
        if (!localPath) return null;
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })

        fs.unlinkSync(localPath)

        console.log("file is uploaded on cloudinary ", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localPath)
        return null;
    }
}
export const deleteImageOnCloudinary = async (publicId: string) => {
    try {
        publicId = getPublicId(publicId);
        const result = await cloudinary.uploader.destroy(publicId);

        console.log("Image deleted from cloudinary ", result);
    } catch (error) {
        console.error(error);
    }
}

export const deleteVideoOnCloudinary = async (publicId: string) => {
    try {
        publicId = getPublicId(publicId);
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });

        console.log("Video deleted from cloudinary");
    } catch (error) {
        console.error(error);
    }
}
