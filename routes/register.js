const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//! User model
const User = require("../models/User");

router.post(
  "/",
  [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a 6 digit password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { name, email, password } = req.body;

      //! Check if user exists
      let user = await User.findOne({ email: email });

      if (user) {
        return res.status(400).json({ msg: "User already exists!" });
      }

      //! If user is NOT in the database
      user = new User({
        name: name,
        email: email,
        password: password,
      });

      //! HASHING THE PASSWORD
      //! Before creating a new user, hash the password
      const salt = await bcrypt.genSalt(10); //! Standard from bcrypt

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //! JWT
      const payload = {
        user: {
          id: user.id, //! The user ID will go with the token
        },
      };

      jwt.sign(
        payload, //! User ID
        process.env.SECRET,
        {
          expiresIn: 40000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //! Send the token to the front end
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
