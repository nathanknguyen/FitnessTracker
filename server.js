const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// routes
app.use(require("./routes/api.js"));
app.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/exercise.html"));
});
app.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/stats.html"));
});
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});