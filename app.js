process.env.NODE_ENV = !process.env.NODE_ENV ? 'dev' : 'test'

const app = require('express')();
const mongoose = require('mongoose');
const { DB_URL } = require('./config');
const bodyParser = require('body-parser');

app.use(bodyParser.json())

mongoose.connect(DB_URL)
  .then(() => console.log(`Connected to the ${process.env.NODE_ENV} database`))
  .catch(err => console.log(err))

module.exports = app;