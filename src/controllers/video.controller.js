import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// 1. You need to take videoFile, thumbnail as form-data request
// 2. upload Video, thumbnail to cloudinary
// 3. Take duration, description as input
// 4. Need to have count for the number of request made for video URL
const uploadVideo = asyncHandler(async (req,res) => {
    const { title, description } = req.body

    if(!title ||!description){
        throw new ApiError(400, "All video details are required!")
    }

    const videoFilePath = req.files?.videoFile[0]?.path
    if(!videoFilePath){
        throw new ApiError(400, "Video file not uploaded")
    }
    
    const thumbnailPath = req.files?.thumbnail[0]?.path
    if(!thumbnailPath){
        throw new ApiError(400, "Thumbnail not uploaded")
    }

    const videoFile = await uploadOnCloudinary(videoFilePath)
    const videoFileURL = videoFile?.secure_url
    if(!videoFileURL ){
        throw new ApiError(400, "Issue while uploading video file, please reupload")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath)
    const thumbnailURL = thumbnail?.secure_url
    if(!thumbnailURL ){
        throw new ApiError(400, "Issue while uploading thumbnail, please reupload")
    }

    const duration = videoFile?.duration

    const videoDetails = await Video.create({
        videoFile: videoFileURL,
        thumbnail: thumbnailURL, 
        title,
        description,
        duration, 
        owner: req.user._id,
    })

    return res
    .status(200)
    .json( new ApiResponse(200, videoDetails, "Testing video upload") )
})

export {
    uploadVideo
}