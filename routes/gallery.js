const express = require("express");
const router = express.Router();
const Gallery = require("../models/gallery");
const middleware = require("../middleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
});

// Create a multer storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Optional folder name in Cloudinary
    allowedFormats: ["jpg", "png"], // Allowed image formats
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    // Retrieve all galleries from the database
    const galleries = await Gallery.find();

    // Render the galleries view and pass the galleries data
    res.render("gallery/gallery", { galleries });
  } catch (err) {
    res.status(400).json({ message: err.message });
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


router.post(
  "/",
  middleware.isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      const { originalname, path } = req.file;

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(path);

      // Create a new Gallery instance with Cloudinary's public URL and other information
      const newGallery = new Gallery({
        name: originalname,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });

      // Save the new Gallery instance to the database
      const savedGallery = await newGallery.save();
      req.flash("success", "gallery successfully uploaded");
      // Redirect to the gallery page
      res.status(201).redirect("/gallery");
    } catch (err) {
      req.flash("error", "Failed to upload gallery");
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
