const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/api', () => {

  let topics, comments, articles, users;

  beforeEach(() => {
    return seedDB()
    .then((docs) => {
      //console.log(`Database sucessfully seeded with ${commentDocs.length} comment docs`)
      [topics, comments, articles, users] = docs
    })
  });

  after(() => {
    return mongoose.disconnect()
    .then(() => console.log('Sucessfully disconnected from test DB'))
  })

  describe('/topics', () => {
    
    it('Get /', () => {
      
    });

  });

});

