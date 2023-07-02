const router = require("express").Router();
const Email = require("../models/emails");

// Handle form submission
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;

    // Create a new email document
    const newEmail = new Email({
      email: email,
    });

    // Save the email to the database
    await newEmail.save();

    req.flash("success", "Email subscribed successfully!");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error", "Error saving email.");
    res.redirect("/");
  }
});

module.exports = router;
