process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

const mongoose = require('mongoose');
const seedDB = require('./seed');
const { DB_URL }  = require('../config');

mongoose.connect(DB_URL)
  .then(() => seedDB())
  .then((docs) => {
    console.log(DB_URL)
    console.log(`${process.env.NODE_ENV} DB sucessfully seeded with ${docs[0].length} comments, ${docs[1].length} articles, ${docs[2].length} users, ${docs[3].length} topics`)
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Sucessfully disconnected from ${process.env.NODE_ENV} DB`)
  })
  .catch((err) => {
    console.log(err);
    return mongoose.disconnect()
  })

 