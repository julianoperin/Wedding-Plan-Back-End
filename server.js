const express = require("express");
const app = express();
const connectDB = require("./config/db");

//!Connect to DB
connectDB();

app.use(express.json({ extended: true }));

app.use("/register", require("./routes/register.js"));
app.use("/auth", require("./routes/auth.js"));
app.use("/guests", require("./routes/guests.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server running on PORT ${PORT}`);
});
