import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { env } from "./env";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})

export const uploadOncloudinary = async (localPath: string) => {
    try {
        if(!localPath) return null;
        const response = await cloudinary.uploader.upload(localPath,{
            resource_type: "auto"
        })

        fs.unlinkSync(localPath)

        console.log("file is uploaded on cloudinary " , response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localPath)
        return null;
    }   
}