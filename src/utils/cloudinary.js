import { v2 as cloudinary } from "cloudinary";
import fs from "fs"
import { ApiError } from "./apiError.js";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response=await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            }
        )

        // console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as file got uploaded on the server
        return null
    }
}

const deleteFromCloudinary=async(oldFilePath)=>{
    try {
        const response=await cloudinary.uploader.destroy(oldFilePath)

        console.log(response);
        
        return response;
        
    } catch (error) {
        throw new ApiError(500,"failed to delete cloudnary.js")
    }
}

export {uploadOnCloudinary,deleteFromCloudinary}