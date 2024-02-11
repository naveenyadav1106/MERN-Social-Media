import mongoose from 'mongoose'


const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        // Likes on the post, represented as a map of user IDs to like status
        // Each key-value pair represents whether a user has liked the post or not
        likes: {
            type: Map, // Using Map to store key-value pairs
            of: Boolean // Values in the map are of type Boolean (true for like, false for no like)
        },
        // Comments on the post, stored as an array of objects
        comments: {
            type: Array,
            default: []
        },
    }, { timestamps: true }
);

const Post = mongoose.model('Post', postSchema)

export default Post;