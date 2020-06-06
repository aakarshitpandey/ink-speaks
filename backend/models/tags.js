const mongoose = require('mongoose')

//creating tag schema
const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    blogs: {
        type: [mongoose.Types.ObjectId],
        required: false,
        ref: 'Blog'
    }
});

module.exports = mongoose.model("Tags", tagSchema);
