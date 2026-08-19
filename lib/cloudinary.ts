import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAvatar = async (fileBuffer: Buffer, userId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "trackerlist/avatars",
                public_id: `user_${userId}`,
                overwrite: true,
                transformation: [
                    { width: 300, height: 300, crop: "fill", gravity: "face" },
                ],
            },
            (error, result) => {
                if (error || !result) {
                    reject(error);
                    return;
                }
                resolve(result.secure_url);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;