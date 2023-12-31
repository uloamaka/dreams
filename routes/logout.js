const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Something went wrong.");
      console.error(err);
      return next(err);    
    }
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
  });
});


module.exports = router;
