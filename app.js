const app = require("express")();
const mongoose = require("mongoose");
const { DB_URL } = process.env.DB_URL ? process.env : require("./config");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

mongoose
  .connect(DB_URL)
  .then(() => console.log(`Connected to ${DB_URL}`))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());

app.use("/api", apiRouter);

app.get("/*", (req, res, next) => {
  next({ status: 404 });
});

app.use((err, req, res, next) => {
  if (
    err.status === 404 ||
    err.message === "Cannot read property '_id' of null"
  )
    res.status(404).send({ message: "404 - Page Not Found" });
  else if (err.status === 400) {
    res.status(400).send({ message: "Bad Request" });
  } else {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = app;
