const mongoose = require("mongoose");

const gallery = new mongoose.Schema({
  name: String,
  imageUrl: String, // Store the Cloudinary URL of the uploaded image
  publicId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Gallery = mongoose.model("Gallery", gallery);

module.exports = Gallery;
