const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/api', () => {

  let topics;
  let comments; 
  let articles;
  let users;

  beforeEach(() => {
    return seedDB()
    .then(docs => {
      console.log(`${process.env.NODE_ENV} DB sucessfully seeded with ${docs[0].length} comments, ${docs[1].length} articles, ${docs[2].length} users, ${docs[3].length} topics`);

      [comments, articles, users, topics] = docs
    })
  });

  describe('/topics', () => {
    
    it('Get /', () => {

    });

  });


  after(() => {
    return mongoose.disconnect()
    .then(() => console.log(`Sucessfully disconnected from ${process.env.NODE_ENV} DB`))
  })

});

