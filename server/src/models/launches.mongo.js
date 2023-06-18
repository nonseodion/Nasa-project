const mongoose = require("mongoose");

const LaunchSchema = new mongoose.Schema({
  target: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true
  },
  flightNumber: {
    type: Number,
    required: true,
  },
  success: {
    type: Boolean,
    required: true
  },
  upcoming: {
    type: Boolean,
    required: true
  },
  launchDate: {
    type: Date,
    required: true
  },
  rocket: {
    type: String,
    required: true
  },
  customers: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model("Launch", LaunchSchema)
