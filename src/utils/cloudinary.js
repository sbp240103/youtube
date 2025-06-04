import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localfilePath) => {
    try {
        if(!localfilePath) {
            throw new Error('No file path provided for upload');
        }
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: 'auto'
        })
        // file uploaded successfully
        console.log('File uploaded successfully to Cloudinary',response.url);
        return response; 
    } catch (error) {
        fs.unlinkSync(localfilePath); // delete the file from local storage
        return null;
    }
}