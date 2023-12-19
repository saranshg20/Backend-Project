// consider file is available in the server
// and from there you need to upload it to clodinary
// on successful upload remove the file from the server

import {v2 as cloudinary} from "cloudinary"
import fs from fs

// unlink in fs ==> for removing file
// no delete term is used 
      
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // upload the path on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: auto
        })

        // file is uploaded in cloudinary
        console.log("File is uploaded successfully ", response.url)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath)
        // remove the locally saved temporary file as the 
        // upload operation gets failed
        return null
    }
}

export {uploadOnCloudinary}