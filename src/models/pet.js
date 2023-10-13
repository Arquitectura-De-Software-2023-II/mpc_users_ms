const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  animal: {
    type: String,
    required: true,
    default: "dog"
  },
});

module.exports = mongoose.model('pet', petSchema);