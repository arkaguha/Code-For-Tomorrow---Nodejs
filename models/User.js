const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  mongoose.Schema(
    {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    },
    { collection: "users" }
  )
);
