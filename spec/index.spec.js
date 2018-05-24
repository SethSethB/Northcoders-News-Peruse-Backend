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
        expect(res.body.topics[0]).to.have.keys('title', 'slug', '_id', '__v')
      })
    });

    it('GET "/:topic_id/articles" should return all articles docs for that topic as an object, with comment count also included ', () => {
      return request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then ( res => {
        expect(res.body.articles.length).to.equal(2);
        expect(res.body.articles[0]).to.have.keys('title', 'body', '__v', 'belongs_to', 'comments', 'created_by', 'votes', '_id');
        expect(res.body.articles[0].comments).to.equal(2)
        expect(res.body.articles[1].comments).to.equal(2)
      })
    });

    it('GET "/:topic_id/articles" should return a 404 with message if no articles for a topic found', () => {
      return request
      .get('/api/topics/sam/articles')
      .expect(404)
      .then ( res => {
        expect(res.body.message).to.equal('404 - Page Not Found')
      })
    });

    it('POST "/:topic_id/articles" should add an article doc and return a 201 and the new article for correct input', () => {
      return request
        .post('/api/topics/mitch/articles')
        .send({'title': 'Mitch is the best', 'body': 'I hope Sam doesnt read this'})
        .expect(201)
        .then (res => {
          expect(res.body.title).to.equal('Mitch is the best');
          expect(res.body.body).to.equal('I hope Sam doesnt read this');
          expect(res.body.votes).to.equal(0)
          expect(res.body.belongs_to).to.equal('mitch')
          return request.get('/api/topics/mitch/articles').expect(200)
        })
        .then( res => {
          expect(res.body.articles.length).to.equal(3)
        })
    });

    it('POST "/:topic_id/articles" should return 400 with message if incorrect input and not add article', () => {
      return request
      .post('/api/topics/mitch/articles')
      .send({'title': 'Mitch is the best'})
      .expect(400)
      .then (res => {
        expect(res.body.message).to.equal('Bad Request');
        return request.get('/api/topics/mitch/articles').expect(200)
      })
      .then( res => {
        expect(res.body.articles.length).to.equal(2)
      })
    });
  });

  describe('/articles', () => {
  
    it('GET "/" should return all articles as an object with comment counts included', () => {
      return request
      .get('/api/articles')
      .expect(200)
      .then(res => {
        expect(res.body.articles.length).to.equal(4)
        expect(res.body.articles[0]).to.have.keys('title', 'body', 'belongs_to', '__v', 'votes', 'created_by', '_id', 'comments')
        expect(res.body.articles[0].comments).to.equal(2)
      })
    });

    it('GET /:article_id should return an object with matching id number', () => {
      const {_id, title} = articles[0];

      return request
        .get(`/api/articles/${_id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Object')
          expect(res.body.title).to.equal(title)
          // expect(res.body.comments).to.equal(10)
        })
    });

    it('GET /api/articles/:article_id/comments', () => {
      
    });

  });

});

