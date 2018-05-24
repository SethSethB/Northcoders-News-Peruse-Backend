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
    .then(([topicDocs, commentDocs, articleDocs, userDocs]) => {
      console.log(`Database sucessfully seeded with ${commentDocs.length} comment docs`)
      topics = topicDocs
      comments = commentDocs
      articles = articleDocs
      users = userDocs
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

