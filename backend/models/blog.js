const mongoose = require('mongoose')

//creating blog schema
const blogSchema = new mongoose.Schema({
    authorID: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: 'No title'
    },
    data: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BlogContent'
    },
    reactions: {
        type: Object,
        default: { likes: 0, views: 0, likedUsers: [], viewedUsers: [] }
    },
    categories: {
        type: Array,
        default: [],
    },
    isPosted: {
        type: Boolean,
        default: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Blog", blogSchema);
