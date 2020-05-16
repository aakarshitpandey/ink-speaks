const mongoose = require("mongoose");

//creating user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: -1
    },
    email: {
        type: String,
        required: true
    },
    blogs: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("User", userSchema);