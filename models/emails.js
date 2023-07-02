const mongoose = require("mongoose");
// Create a schema for the email
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: false,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
});
// Create a model for the email
const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
