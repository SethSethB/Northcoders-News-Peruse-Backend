process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
const seedDB = require('./seed');
const { DB_URL }  = require('../config');

mongoose.connect(DB_URL)
  .then(() => seedDB())
  .then((commentDocs) => {
    console.log(`Database sucessfully seeded with ${commentDocs.length} comment docs`)
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Sucessfully disconnected from dev DB')
  })
  .catch((err) => {
    console.log(err);
    return mongoose.disconnect()
  })

 