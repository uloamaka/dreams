const express = require("express");
const router = express.Router();
const Gallery = require("../models/gallery");
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
    cb(null, `gallery-${uniqueSuffix}.${extension}`); // Set the filename for the uploaded image
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage, limits: { fileSize: 10000000 } });

//GET all galleries
router.get("/", async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.render("gallery/gallery", { galleries });
  } catch (err) {
    const message = err.message || "Error retrieving galleries";
    req.flash("err", "err.message");
  }
});


// Render the form to add images to gallery
router.get("/new", middleware.isLoggedIn, async (req, res) => {
  try {
    res.render("gallery/form");
  } catch (err) {
    const message = err.message || "Error rendering new galliery form";
    res.status(500).send({ message });
  }
});

// GET a single gallery by id
router.get("/:id", getGallery, (req, res) => {
  res.render("gallery/gallery-details", { gallery: res.gallery });
});

// CREATE a new gallery post
router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { filename } = req.file; // Get the filename of the uploaded image
      const newGallery = new Gallery({
        image: filename,
      });
      const savedGallery = await newGallery.save();
      res.status(201).redirect("/gallery");
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// UPDATE a gallery by id
router.put("/:id", getGallery, async (req, res) => {
  if (req.body.images != null) {
    res.gallery.images = req.body.images;
  }
  try {
    const updatedGallery = await Gallery.findByIdAndUpdate(req.params.id, {
      image: req.body.image,
    });
    res.json(updatedGallery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a gallery by id
router.delete("/:id", getGallery, async (req, res) => {
  try {
    await res.gallery.deleteOne();
    res.json({ message: "Gallery deleted" });
  } catch {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a gallery by id
async function getGallery(req, res, next) {
  let gallery;
  try {
    gallery = await Gallery.findById(req.params.id);
    if (gallery == null) {
      return res.status(404).json({ message: "Gallery not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.gallery = gallery;
  next();
}

module.exports = router;
