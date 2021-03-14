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

//! DELETE
router.delete("/:id", auth, async (req, res) => {
  try {
    let guest = await Guest.findById(req.params.id);
    if (!guest) return res.status(404).json({ msg: "Guest not found" });
    // check if user owns the guest
    //   if (guest.user.toString() !== req.user.id) {
    //     return res.status(401).json({ msg: 'Not authorized' })
    //   }

    await Guest.findByIdAndRemove(req.params.id);
    res.send("Guest Removed");
  } catch (error) {
    console.error(error.message).json("Server Error");
  }
});

//! UPDATE
router.put("/:id", auth, async (req, res) => {
  const { name, phone, dietary = "Non-Veg", isConfirmed } = req.body;

  //! Build new Guest object
  const updateGuest = { name, phone, dietary, isConfirmed };

  try {
    let guest = await Guest.findById(req.params.id);

    if (!guest) return res.status(404).json({ msg: "Guest not found" });

    // Make sure user owns the guest
    //   if (guest.user.toString() !== req.user.id) {
    //     return res.status(401).json({ msg: 'Not authorised' })
    //   }

    guest = await Guest.findByIdAndUpdate(
      req.params.id,
      { $set: updateGuest },
      { new: true }
    );
    res.send(guest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
