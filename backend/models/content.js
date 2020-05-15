const mongoose = require('mongoose')

//creating blog schema
const blogSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("BlogContent", blogSchema);
