import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { removeFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { mongoose } from 'mongoose';

// 1. You need to take videoFile, thumbnail as form-data request
// 2. upload video, thumbnail to cloudinary
// 3. Take duration, description as input
// 4. Need to have count for the number of request made for video URL to show {views}
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
        await removeFromCloudinary(videoFileURL)
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

/**
 * To retrieve all the videos associated with users(self) channel
 */
const channelVideos = asyncHandler(async(req,res) => {
    if(!req.user){
        throw new ApiError(400, "Issue while verifying user!")
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        }, 
        {
            $project: {
                _id: 0,
                videoFile: 1,
                thumbnail: 1,
                views: 1, 
                createdAt: 1
            }
        }
    ])

    if(!channelVideos?.length){
        throw new ApiError(404, "No videos with associated with logged in user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos[0], "User Channel videos fetched successfully")
    )
})

/**
 * TODO: To retrieve all the videos associated with a channel (input username)
 */

export {
    uploadVideo,
    channelVideos
}