const app = require('../app');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/api', () => {

  let topics, comments, articles, users;

  beforeEach(() => {
    return seedDB()
    .then(docs => {
      console.log(`${process.env.NODE_ENV} DB sucessfully seeded with ${docs[0].length} comments, ${docs[1].length} articles, ${docs[2].length} users, ${docs[3].length} topics`)
      [topics, comments, articles, users] = docs
      console.log(topics)
      console.log(comments.length)
      console.log(articles.length)
      console.log(users.length)
    })
  });

  after(() => {
    return mongoose.disconnect()
    .then(() => console.log(`Sucessfully disconnected from ${process.env.NODE_ENV} DB`))
  })

  describe('/topics', () => {
    
    it('Get /', () => {

    });

  });

});

