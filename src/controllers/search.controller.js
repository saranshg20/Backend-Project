import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const getChannelProfileForNotLoggedInUser = asyncHandler(async (req, res) => {
    const username = req.params?.username?.trim();

    if (!username || username === "") {
        throw new ApiError(400, "Username invalid format or not entered");
    }

    const channel = await User.aggregate([
    {
        $match: {
            username: username?.toLowerCase(),
        },
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers",
        },
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo",
        },
    },
    {
        $addFields: {
            subscribersCount: {
                $size: "$subscribers",
            },
            channelsSubscribedToCount: {
                $size: "$subscribedTo",
            },
        },
    },
    {
      // $project is used to project/pass only selected values
        $project: {
            _id: 0,
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            avatar: 1,
            coverImage: 1,
            email: 1,
        },
    },
    ]);

    if(!channel?.length){
        throw new ApiError(404, "Channel does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User Channel fetched successfully")
    )
});

export { getChannelProfileForNotLoggedInUser };
