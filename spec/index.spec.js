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
      // console.log(`${process.env.NODE_ENV} DB sucessfully seeded with ${docs[0].length} comments, ${docs[1].length} articles, ${docs[2].length} users, ${docs[3].length} topics`);

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

    it('GET "/:topic_id/articles" should return all articles docs for that topic as an object, with comment count included and belongs_to & created_by fields populated', () => {
      return request
      .get('/api/topics/mitch/articles')
      .expect(200)
      .then ( res => {
        expect(res.body.articles.length).to.equal(2);
        expect(res.body.articles[0]).to.have.keys('title', 'body', '__v', 'belongs_to', 'comments', 'created_by', 'votes', '_id');
        expect(res.body.articles[0].comments).to.equal(2)
        expect(res.body.articles[1].comments).to.equal(2)
        expect(res.body.articles[0].belongs_to).to.equal('mitch')
        expect(res.body.articles[0].created_by).to.equal('butter_bridge')
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

    it('POST "/:topic_id/articles" should add an article doc and return a 201 and the new article for correct input, with created_by defaulting to guest id', () => {
      return request
        .post('/api/topics/mitch/articles')
        .send({'title': 'Mitch is the best', 'body': 'I hope Sam doesnt read this'})
        .expect(201)
        .then (res => {
          expect(res.body.title).to.equal('Mitch is the best');
          expect(res.body.body).to.equal('I hope Sam doesnt read this');
          expect(res.body.votes).to.equal(0)
          expect(res.body.belongs_to).to.equal('mitch')
          const guestUserId = `${users[2]._id}`
          expect(res.body.created_by).to.equal(guestUserId)
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

    it('GET "/:article_id" should return an object with matching id number and comment count', () => {
      const {_id, title, belongs_to} = articles[0];

      return request
        .get(`/api/articles/${_id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an('Object')
          expect(res.body.title).to.equal(title)
          expect(res.body.belongs_to).to.equal(belongs_to)
          expect(res.body.comments).to.equal(2)
        })
    });

    it('GET "/:article_id" returns a 404 with message if passed an id which does not exist', () => {
      return request
        .get('/api/articles/notvalidIDnum')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('404 - Page Not Found')
        })
    });

    it('GET "/:article_id/comments" returns all the comments for an article', () => {
      const {_id} = articles[0];
      return request
        .get(`/api/articles/${_id}/comments`)
        .expect(200)
        .then (res => {
          expect(res.body.comments.length).to.equal(2)
          expect(res.body.comments[0].body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.')
          expect(res.body.comments[0].votes).to.equal(7)
        })
    });

    it('GET "/:article_id/comments" returns a 404 with message if passed an id which does not exist', () => {
      return request
        .get('/api/articles/00000000000000000000000/comments')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('404 - Page Not Found')
        })
    });

    it('POST "/:article_id/comments" should add an comment doc to the relevant article and return a 201 + the new article for correct input defaulting to guest user for created_by', () => {
      const {_id} = articles[0]
      return request
      .post(`/api/articles/${_id}/comments`)
      .send({"comment": "Backend is great!"})
      .expect(201)
      .then (res => {
        expect(res.body.body).to.equal('Backend is great!');
        expect(res.body.votes).to.equal(0)
        expect(res.body.belongs_to).to.equal(`${_id}`)
        const guestUserId = `${users[2]._id}`
        expect(res.body.created_by).to.equal(guestUserId)
        return request.get(`/api/articles/${_id}/comments`).expect(200)
      })
      .then( res => {
        expect(res.body.comments.length).to.equal(3)
      })
    });

    it('POST "/:article_id/comments" should return 400 with message if incorrect input and not add article', () => {
      const {_id} = articles[0]
      return request
      .post(`/api/articles/${_id}/comments`)
      .send({})
      .expect(400)
      .then (res => {
        expect(res.body.message).to.equal('Bad Request');
        return request.get(`/api/articles/${_id}/comments`).expect(200)
      })
      .then( res => {
        expect(res.body.comments.length).to.equal(2)
      })
    });

    it('PUT /:article_id?vote=up will increase the votecount of an article by one and return updated object', () => {
      const {_id, votes, title} = articles[0]
      return request
      .put(`/api/articles/${_id}?vote=up`)
      .expect(201)
      .then( res => {
        expect(res.body.title).to.equal(title)
        expect(res.body.votes).to.equal(votes + 1)
      })
    });

    it('PUT /:article_id?vote=down will decrease the votecount of an article by one and return updated object', () => {
      const {_id, votes, title} = articles[0]
      return request
      .put(`/api/articles/${_id}?vote=down`)
      .expect(201)
      .then( res => {
        expect(res.body.title).to.equal(title)
        expect(res.body.votes).to.equal(votes - 1)
      })
    });

    it('PUT /:article_id?vote=somethingelse (ie any vote query which is not up or down) will return the updated object with votes unchanged', () => {
      const {_id, votes, title} = articles[0]
      return request
      .put(`/api/articles/${_id}?vote=somethingelse`)
      .expect(201)
      .then( res => {
        expect(res.body.title).to.equal(title)
        expect(res.body.votes).to.equal(votes)
      })
    });

    it('PUT /:article_id?vote=up will return a 404 for an invalid id', () => {
      return request
      .put(`/api/articles/notAnArticleId?vote=up`)
      .expect(404)
      .then( res => {
        expect(res.body.message).to.equal('404 - Page Not Found')
      })
    });
    
  });

});

