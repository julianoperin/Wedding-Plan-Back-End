const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//! User model
const User = require("../models/User");

//!  Auth Middleware => it will find the user byID
//? JUST Get user from database
//? THE POINT OF THIS ROUTE IS TO GET THE LOGGED IN USER

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //! - password cause we don't want to return the password
    //!This code above will get the user from the DataBase
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//! Login User and get token
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a 6 digit password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let { email, password } = req.body;

      //! Check if user exists
      let user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ msg: "No user found with this email" });
      }

      //! I will use bcrypt to compare the passwords to see if they match
      const isMatch = await bcrypt.compare(password, user.password); //! user.password from user found in DB

      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: "Invalided credentials, password does not match!" });
      }

      await user.save();

      //! JWT - Payload
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
