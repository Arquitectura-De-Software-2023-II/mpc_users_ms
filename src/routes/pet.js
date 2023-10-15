const express = require("express");
const petSchema = require("../models/pet");
const verifyToken = require("./validate-token");

const router = express.Router();

// create pet
router.post("/post", (req, res) => {
  const pet = petSchema(req.body.pet);
  pet
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all pets of a user
router.get("/getall/:id", (req, res) => {
  const { id } = req.params;
  petSchema
    .find({ owner: id },{__v:0})
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get all pets
router.get("/getall", (req, res) => {
  petSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// get a pet
router.get("/get/:id", (req, res) => {
  const { id } = req.params;
  petSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// delete a pet
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  petSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// update a pet
router.put("/put/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, color, breed, owner } = req.body;
  petSchema
    .updateOne({ _id: id }, { $set: { name, age, color, breed, owner } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

module.exports = router;
