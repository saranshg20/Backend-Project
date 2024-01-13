import {mongoose, Schema} from "mongoose"

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        }, 
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video'
            }
        ],
        thumbnail: {
            type: String,
            required: true
        },
    }, {timestamps: true}
)

export const Playlist = mongoose.model('Playlist', playlistSchema)