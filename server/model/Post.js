import mongoose from "mongoose";

const postSchem = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    body: {
        type: String,
        required: true,
    },
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    photo: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
     }],
     likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     }]
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchem);