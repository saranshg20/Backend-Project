import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { response } from "express";

// take input from the user: email, username, password, image
// need to add hash middleware for password
// if input has media resource then save it in the server
// upload the resource in the cloudinary 
// append the link of cloudinary resource in the user info
// save info of user in the database

const registerUser = asyncHandler( async(req,res) => {
    // Following steps must be followed

    // get user details from frontend
    // validation for frontend details - atleast check if it is not empty
    // check if already exists - using email or username or both
    // check for images
    // check for avatar
    // upload them to cloudinary
    // check if successfully uploaded or not
    // create userObject - create entry in db
    // remove password and refreshToken field from response
    // check for user creation
    // if created then return response
    // else give 500 error

    const {fullName, email, username, password} = req.body
    console.log(email)

    /**
     * Validation
     */
    // if(fullName===""){
    //     throw new ApiError(400, "Fullname is requried")
    // }
    // or use multiple if blocks
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    /**
     * Check if user already exists
     */
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    console.log(existedUser)

    if(existedUser){
        throw new ApiError(409, "User with this email or username already exists")
    }

    /**
     * Handle files: avatar, coverImage
     */
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }


    console.log(avatarLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is requried")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required!")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while User Registration")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
} )


export { registerUser }
