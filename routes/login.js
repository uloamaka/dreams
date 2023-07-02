const express = require("express");
const router = express.Router();
const passport = require("passport");

// Show the login form
router.get("/", (req, res) => {
  res.render("register/login");
});

// Handle user login using Passport's local strategy
router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/gallery", 
    failureRedirect: "/", 
    failureFlash: true, 
  }),
);

module.exports = router;
