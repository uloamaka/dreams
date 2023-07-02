const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("events/event", { jsFile: "event.js" });
});


module.exports = router;