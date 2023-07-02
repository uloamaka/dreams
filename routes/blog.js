const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const middleware = require("../middleware");
const multer = require("multer");

// Create a multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Set the destination folder where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique filename for the uploaded image
    const extension = file.originalname.split(".").pop(); // Extract the file extension
    cb(null, `multimedia-${uniqueSuffix}.${extension}`); // Set the filename for the uploaded image
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });


// Get all the blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    // res.json(blogs);
    res.render("blogs/index", { blogs });
  } catch (err) {
    const message = err.message || "Error retrieving galleries";
    res.status(500);
    req.flash(
      "error",
      message +
        "There was an error retrieving the blogs. Please try again later."
    );
  }
});

// Create a new blog post
router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, multimediaDescription } = req.body;
      const newBlog = new Blog({
        title: title,
        content: content,
        multimedia: {
          type: "image",
          url: req.file.filename,
          description: multimediaDescription || "Photo by alex",
        },
        author: req.user.name || "gift", // Set the author field based on the logged-in user
      });
      const savedBlog = await newBlog.save();
      req.flash("success", "Blog successfully created");
      res.redirect(`/blogs/${savedBlog._id}`);
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to create blog");
      res.redirect("/blogs/new");
    }
  }
);


//render the form to add blog post
router.get("/new", middleware.isLoggedIn, (req, res) => {
  try {
    res.render("blogs/form", { author: req.user.username });
  } catch (err) {
    const message = err.message || "Error rendering new blog form";
    res.status(500).json({ message });
  }
});

// Get a specific blog post by ID
router.get("/:id", async (req, res) => {
  try {
    let blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }

    res.render("blogs/show", { blog });
  } catch (err) {
    req.flash("error", "Error retrieving blog");
    res.redirect("/blogs");
  }
});

// Update a blog post by ID
router.patch("/:id/edit", middleware.isLoggedIn, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.send(err);
  }
});

// Delete a blog post by ID
router.delete("/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
      req.flash("error", "Blog not found");
      return res.redirect("/blogs");
    }
    req.flash("success", "Blog deleted successfully");
    res.redirect("/blogs");
  } catch (err) {
    req.flash("error", "Error deleting blog");
    res.redirect("/blogs");
  }
});

module.exports = router;
