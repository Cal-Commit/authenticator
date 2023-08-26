const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config()

const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/cal-commit-auth").then(() => {
  app.listen(8081, () => {
    console.log("Example app listening on port 8081!");
  });
});
