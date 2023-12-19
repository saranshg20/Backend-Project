import mongoose, {Schema, model} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// hooks are used to perform action just befor some other action
// one example is Pre hook
const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        required: true
        // will use cloudinary service
    },
    coverImage: {
        type: String
    },
    watchHistory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

// arrow function can't be used with hooks
// because arrow function do not have context access
// one issue: when user make changes in any other field
// save will again hash the password
// resolved using if block code written below
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password,10)
    next()
}) 

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullName
        }, 
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Just use id in refresh token 
// because it refreshes continuously    
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)
