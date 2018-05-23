process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
const seedDB = require('./seed');
const { DB_URL }  = require('../config');

mongoose.connect(DB_URL)
  .then(() => seedDB())
  .then((someData) => {
    console.log(someData)
    console.log(`Database sucessfully seeded with ${someData.length} docs`)
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Sucessfully disconnected from DB')
  })
  .catch((err) => {
    console.log(err);
    return mongoose.disconnect()
  })

 