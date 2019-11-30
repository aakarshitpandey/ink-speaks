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
    data: {
        type: String,
        required: true,
    },
    reactions: {
        type: Object,
        default: { likes: 0, views: 0 }
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
