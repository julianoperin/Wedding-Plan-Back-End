const router = require("express").Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

//! Guest Model
const Guest = require("../models/Guest");

//! GET
router.get("/", auth, async (req, res) => {
  try {
    const guests = await Guest.find({ user: req.user.id });
    res.json(guests);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//! POST
router.post(
  "/",
  [
    auth,
    [
      check("name", "Please provide the name").not().isEmpty(),
      check("phone", "Please provide the phone").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, diet, isConfirmed } = req.body;

    try {
      const newGuest = new Guest({
        user: req.user.id,
        name,
        phone,
        diet,
        isConfirmed,
      });
      const guest = await newGuest.save();

      res.json(guest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
