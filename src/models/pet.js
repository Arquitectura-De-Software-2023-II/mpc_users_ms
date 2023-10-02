const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true
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
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('pet', petSchema);