const router = require("express").Router();
const { check, validationResult } = require("express-validator");

router.post(
  "/",
  [
    check("name", "Please enter a namer").not().isEmpty(),
    check("email", "Please enter a valid email").not().isEmail(),
    check("password", "Please enter a 6 digit password").isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    res.send("success");
    const { name, email, password } = req.body;
  }
);

module.exports = router;
