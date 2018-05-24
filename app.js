
const app = require('express')();
const mongoose = require('mongoose');
const { DB_URL } = require('./config');
const bodyParser = require('body-parser');
const apiRouter = require("./routes/api-router");

app.use(bodyParser.json())

mongoose.connect(DB_URL)
  .then(() => console.log(`Connected to ${DB_URL}`))
  .catch(err => console.log(err))

app.use("/api", apiRouter);

app.get("/*", (req, res, next) => {
  next({ status: 404 });
});

app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send({message: "404 - Page Not Found"});
  else if (err.status === 400) {
    res.status(400).send({ message: "Bad Request" });
  }
  else{
    console.log(err)
    res.status(500).send({message: "Server problem"})
  }
});

module.exports = app;