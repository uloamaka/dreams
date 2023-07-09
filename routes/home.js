const router = require("express").Router();
const Blog = require("../models/blog")
router.get("/", async (req, res) => {
  
  const blogs = await Blog.find({}).limit(3);
  res.render("home/landing", { blogs });
});

module.exports = router;
