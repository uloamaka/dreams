const router = require("express").Router();
const Joi = require("joi");
const Event = require("../models/contact");

// Define the validation schema using Joi
const eventValidationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().min(5).max(255).required(),
  phone: Joi.string().min(10).max(20).required(),
  eventType: Joi.string().min(5).max(255).required(),
  requestedDate: Joi.date().required(),
  estimatedGuestCount: Joi.number().min(1).required(),
  additionalNote: Joi.string().max(1000),
});

// Get contactform to add a new event
router.get("/", (req, res) => {
  try {
    res.render("contact/form");
  } catch (err) {
    const message = err.message || "Error rendering new contact form";
    req.flash("error", message);
    res.status(500).redirect("/");
  }
});

// Get all events from the database
router.get("/requests", async (req, res) => {
  try {
    const events = await Event.find();
    res.render("contact/index", { events });
  } catch (err) {
    const message = err.message || "Error retrieving event requests";
    req.flash("error", message);
    res.status(500).redirect("/");
  }
});

// Get a single event by ID from the database
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash("error", "Event not found");
      return res.status(404).redirect("/events");
    }
    res.render("events/show", { event });
  } catch (err) {
    const message = err.message || "Error retrieving event";
    req.flash("error", message);
    res.status(500).redirect("/events");
  }
});
// Save the events to the database
router.post("/", async (req, res) => {
  try {
    const { error } = eventValidationSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.status(400).redirect("/contact");
    }
    const event = new Event(
     req.body
    );
    await event.save();
    req.flash("success", "Request submitted successfully, our team will get back to you ASAP!");
    return res.redirect("../gallery");
  } catch (error) {
    req.flash("error", "Error submitting request: " + error.message);
    console.error("Error submitting request:", error.message);
    return res.redirect("../contact/");
  }
});

module.exports = router;
