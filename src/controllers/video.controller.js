import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import {
    removeFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { mongoose } from "mongoose";

// 1. You need to take videoFile, thumbnail as form-data request
// 2. upload video, thumbnail to cloudinary
// 3. Take duration, description as input
// 4. Need to have count for the number of request made for video URL to show {views}
const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "All video details are required!");
    }

    const videoFilePath = req.files?.videoFile[0]?.path;
    if (!videoFilePath) {
        throw new ApiError(400, "Video file not uploaded");
    }

    const thumbnailPath = req.files?.thumbnail[0]?.path;
    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail not uploaded");
    }

    console.log("Uploading Video File")
    const videoFile = await uploadOnCloudinary(videoFilePath);
    const videoFileURL = videoFile?.secure_url;
    if (!videoFileURL) {
        throw new ApiError(
            400,
            "Issue while uploading video file, please reupload"
        );
    }

    console.log("Uploading thumbnail")
    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    const thumbnailURL = thumbnail?.secure_url;
    if (!thumbnailURL) {
        await removeFromCloudinary(videoFileURL);
        throw new ApiError(400, "Issue while uploading thumbnail, please reupload");
    }

    const duration = videoFile?.duration;

    const videoDetails = await Video.create({
        videoFile: videoFileURL,
        thumbnail: thumbnailURL,
        title,
        description,
        duration,
        owner: req.user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, videoDetails, "Testing video upload"));
});

/**
 * To retrieve all the videos associated with users(self) channel
 */
const channelVideos = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(400, "Issue while verifying user!");
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $project: {
                _id: 0,
                videoFile: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!channelVideos?.length) {
        throw new ApiError(404, "No videos with associated with logged in user");
    }

    console.log(videos)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos[0],
                "User Channel videos fetched successfully"
            )
        );
});

const likeVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    if (!videoId) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const alreadyLikedVideo = await Like.findOne({
        videoId: videoId,
        likedBy: req.user._id
    })

    if (alreadyLikedVideo != null) {
        throw new ApiError(400, "User has already liked the video")
    }

    const like = await Like.create({
        videoId: videoId,
        likedBy: req.user._id,
    });

    if (!like) {
        throw new ApiError(500, "Internal Database server error");
    }

    return res.status(200).json(200, new ApiResponse(200, like));
});

const dislikeVideo = asyncHandler(async (req, res) => {
    const reqVideoId = req.params.videoId;

    const disliked = await Like.findOneAndDelete({ videoId: reqVideoId }).select(
        "-_id -createdAt -updatedAt"
    );
    if (!disliked) {
        throw new ApiError(400, "User has not liked the video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, disliked, "Disliked the video"));
});

const commentOnVideo = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    if (!comment.trim()) {
        throw new ApiError(400, "Empty comment string");
    }

    const videoId = req.params?.videoId;
    if (!videoId) {
        throw new ApiError(404, "Video Id not found");
    }

    const user = req?.user;
    if (!user) {
        throw new ApiError(404, "User not logged in");
    }

    const commentDetails = await Comment.create({
        content: comment,
        video: videoId,
        owner: user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, commentDetails, "Added comment successfully"));
});

const getVideoUsingID = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    console.log(req.user._id)

    const videoDetails = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "commentsInVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "commentId",
                            as: "commentLikes"
                        }
                    },
                    {
                        $addFields: {
                            likeCount: { $size: "$commentLikes" }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            content: 1,
                            owner: 1,
                            likeCount: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "videoId",
                as: "likesInVideo",
            },
        },
        {
            $addFields: {
                likeCount: { $size: "$likesInVideo" }
            }
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                likeCount: 1,
                views: 1,
                createdAt: 1,
                updatedAt: 1,
                hasUserLikedVideo: 1,
                arrayOfComments: {
                    $map: {
                        input: "$commentsInVideo",
                        as: "comment",
                        in: {comment: "$$comment.content", commentedBy: "$$comment.owner", likesInComment: "$$comment.likeCount"},
                    },
                },
                likesInVideo: {
                    $map: {
                        input: "$likesInVideo",
                        as: "like",
                        in: "$$like.likedBy"
                    }
                }
            },
        },
    ]);

    if(!videoDetails){
        throw new ApiError(404, "Video not found")
    }

    const hasUserLikedVideo = await Like.find({ likedBy: req.user._id, videoId: videoId });

    return res.status(200).json(
        new ApiResponse(200, {
            videoDetails,
            'hasUserLikedVideo': hasUserLikedVideo
        })
    );
});

const likeCommentOnVideo = asyncHandler(async (req, res) => {
    const commentId = req.params?.commentId;
    const user = req?.user;

    if (!commentId || !user) {
        throw new ApiError(400, "More information requried to like comment");
    }

    const alreadyLikedComment = await Like.findOne({
        commentId: commentId,
        likedBy: user._id
    })

    if (alreadyLikedComment != null) {
        throw new ApiError(400, "User has already liked the comment")
    }

    const like = await Like.create({
        likedBy: user._id,
        commentId: commentId,
    });

    if (!like) {
        throw new ApiError(500, "Internal database server error");
    }

    return res.status(200).json(new ApiResponse(200, like, "Liked the comment"));
});

const publishVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    if (!videoId) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const video = await Video.findOneAndUpdate(
        { _id: videoId },
        { published: true },
        { new: true }
    );

    if (!video) {
        throw new ApiError(500, "Internal Database server error");
    }

    return res.status(200).json(new ApiResponse(200, video, "Published the video"));
})

const unpublishVideo = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId;
    if (!videoId) {
        throw new ApiError(400, "Invalid Video Id");
    }

    const video = await Video.findOneAndUpdate(
        { _id: videoId },
        { published: false },
        { new: true }
    );

    if (!video) {
        throw new ApiError(500, "Internal Database server error");
    }

    return res.status(200).json(new ApiResponse(200, video, "Unpublished the video"));
})

/**
 * TODO: To retrieve all the videos associated with a channel (input username)
 */

export {
    channelVideos,
    likeVideo,
    dislikeVideo,
    commentOnVideo,
    likeCommentOnVideo,
    getVideoUsingID,
    publishVideo,
    unpublishVideo,
    uploadVideo,
};
