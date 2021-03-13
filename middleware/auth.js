//? THE AUTH MIDDLEWARE WILL CHECK IF THERE IS A TOKEN IN THE HEADER
const jwt = require("jsonwebtoken");
require("dotenv").config();

//! Middleware is used in private routes to protect the routes;

const auth = (req, res, next) => {
  //! GET TOKEN FROM THE HEADER
  const token = req.header("auth-token");

  //! CHECK IF NOT TOKEN
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    req.user = decoded.user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
