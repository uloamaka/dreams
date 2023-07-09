const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  multimedia: {
    type: {
      type: String,
      enum: ["video", "image", "audio", "interactive"],
      default: "image",
    },
    name: {
      type: String,
      required: true, // This field is required
    },
    imageUrl: String, // Store the Cloudinary URL of the uploaded image
    publicId: String,
    description: {
      type: String,
      default: "Photo by alex",
    },
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
