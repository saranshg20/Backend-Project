import {mongoose, Schema} from 'mongoose'

const likeSchema = new Schema(
    {
        commentId: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            index: true
        },
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            index: true
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, { timestamps:true }
)

export const Like = mongoose.model('Like', likeSchema)
