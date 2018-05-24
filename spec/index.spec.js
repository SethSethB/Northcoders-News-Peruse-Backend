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

  after(() => {
    return mongoose.disconnect()
    .then(() => console.log(`Sucessfully disconnected from ${process.env.NODE_ENV} DB`))
  })

  describe('/topics', () => {
    
    it('GET "/" should return all topics as an object', () => {
      return request
      .get('/api/topics')
      .expect(200)
      .then(res => {
        expect(res.body.topics.length).to.equal(2)
      })
    });

    it('GET "/:topic_id/articles" should return all topics as an object', () => {
      return request.get('/api/topics/mitch/articles')
      .expect(200)
      .then ( res => {
        expect(res.body.articles.length).to.equal(2)
      })
    });

    it('GET "/:topic_id/articles" should return a 404 with message if no articles for a topic found', () => {
      return request.get('/api/topics/sam/articles')
      .expect(404)
      .then ( res => {
        expect(res.body.message).to.equal('404 - Page Not Found')
      })
    });

    it('POST "/:topic_id/articles" should add an article doc and return a 201 and the new article for correct input', () => {
      return request.post('/api/topics/mitch/articles')
        .send({'title': 'Mitch is the best', 'body': 'I hope Sam doesnt read this'})
        .expect(201)
        .then (res => {
          expect(res.body.title).to.equal('Mitch is the best')
          expect(res.body.body).to.equal('I hope Sam doesnt read this');
          return request.get('/api/topics/mitch/articles').expect(200)
        })
        .then( res => {
          expect(res.body.articles.length).to.equal(3)
        })
    });
  });
});

