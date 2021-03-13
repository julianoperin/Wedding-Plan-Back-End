const express = require("express");
const app = express();
const connectDB = require("./config/db");

//!Connect to DB
connectDB();

app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server running on PORT ${PORT}`);
});
