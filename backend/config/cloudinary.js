import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (filePath)=>{
  cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret:CLOUDINARY_API_SECRET
});
try {
    const uploadResult = await cloudinary.uploader
    .upload(filePath)
    fs.unlinkSync(filePath)
    return uploadResult.secure_url
} catch (error) {
    fs.unlinkSync(filePath)
    return res.status(400).json({message: "cloudinary error"});
}
}

export default uploadOnCloudinary;