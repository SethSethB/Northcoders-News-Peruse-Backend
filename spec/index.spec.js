const app = require("../app");
const { expect } = require("chai");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const apiRoutesRef = require("../api_homepage");

describe("/api", () => {
  let topics;
  let comments;
  let articles;
  let users;

  beforeEach(() => {
    return seedDB().then(docs => {
      [comments, articles, users, topics] = docs;
    });
  });

  after(() => {
    return mongoose
      .disconnect()
      .then(() => console.log(`Sucessfully disconnected from DB`));
  });

  describe("/", () => {
    it('GET "/" returns a json object with api routes and descriptions as key-value pairs', () => {
      return request
        .get("/api")
        .expect(200)
        .then(res => {
          expect(res.body).to.eql(apiRoutesRef);
        });
    });
  });

  describe("/topics", () => {
    it('GET "/" should return all topics as an object', () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[0]).to.have.keys(
            "title",
            "slug",
            "_id",
            "__v"
          );
        });
    });

    it('POST "/" should add a topic doc and return a 201 and the new topic as an object', () => {
      return request
        .post("/api/topics")
        .send({ title: "ExcitingNewTopic" })
        .expect(201)
        .then(res => {
          expect(res.body.title).to.equal("ExcitingNewTopic");
          expect(res.body.slug).to.equal("excitingnewtopic");
          return request.get("/api/topics").expect(200);
        })
        .then(res => {
          expect(res.body.topics.length).to.equal(3);
        });
    });

    it('POST "/" should return 400 with message if incorrect input and not add topic', () => {
      return request
        .post("/api/topics")
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
          return request.get("/api/topics").expect(200);
        })
        .then(res => {
          expect(res.body.topics.length).to.equal(2);
        });
    });

    it('GET "/:topic/articles" should return all articles docs for that topic slug as an object, with comment count included and belongs_to & created_by fields populated', () => {
      return request
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0]).to.have.keys(
            "title",
            "body",
            "__v",
            "belongs_to",
            "comments",
            "created_by",
            "votes",
            "_id"
          );
          expect(res.body.articles[0].comments).to.equal(2);
          expect(res.body.articles[1].comments).to.equal(2);
          expect(res.body.articles[0].belongs_to).to.equal("mitch");
          expect(res.body.articles[0].created_by.username).to.equal(
            "butter_bridge"
          );
        });
    });

    it('GET "/:topic/articles" should return a 404 with message if no articles for a topic found', () => {
      return request
        .get("/api/topics/sam/articles")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("404 - Page Not Found");
        });
    });

    it('POST "/:topic/articles" should add an article doc and return a 201 and the new article for correct input, with created_by defaulting to guest id', () => {
      return request
        .post("/api/topics/mitch/articles")
        .send({
          title: "Mitch is the best",
          body: "I hope Sam doesnt read this"
        })
        .expect(201)
        .then(res => {
          expect(res.body.title).to.equal("Mitch is the best");
          expect(res.body.body).to.equal("I hope Sam doesnt read this");
          expect(res.body.votes).to.equal(0);
          expect(res.body.belongs_to).to.equal("mitch");
          const guestUserId = `${users[2]._id}`;
          expect(res.body.created_by).to.equal(guestUserId);
          return request.get("/api/topics/mitch/articles").expect(200);
        })
        .then(res => {
          expect(res.body.articles.length).to.equal(3);
        });
    });

    it('POST "/:topic/articles" if topic does not exist, should post the article successfully and create a new topic doc in the DB', () => {
      return request
        .post("/api/topics/shinyNewTopic/articles")
        .send({
          title: "Mitch is the best",
          body: "I hope Sam doesnt read this"
        })
        .expect(201)
        .then(res => {
          expect(res.body.title).to.equal("Mitch is the best");
          expect(res.body.body).to.equal("I hope Sam doesnt read this");
          expect(res.body.votes).to.equal(0);
          expect(res.body.belongs_to).to.equal("shinynewtopic");
          const guestUserId = `${users[2]._id}`;
          expect(res.body.created_by).to.equal(guestUserId);
          return request.get("/api/topics/shinynewtopic/articles").expect(200);
        })
        .then(res => {
          expect(res.body.articles.length).to.equal(1);
          return request.get("/api/topics").expect(200);
        })
        .then(res => {
          expect(res.body.topics.length).to.equal(3);
          expect(res.body.topics[2].title).to.equal("shinyNewTopic");
          expect(res.body.topics[2].slug).to.equal("shinynewtopic");
        });
    });

    it('POST "/:topic_id/articles" should return 400 with message if incorrect input and not add article', () => {
      return request
        .post("/api/topics/mitch/articles")
        .send({ title: "Mitch is the best" })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
          return request.get("/api/topics/mitch/articles").expect(200);
        })
        .then(res => {
          expect(res.body.articles.length).to.equal(2);
        });
    });
  });

  describe("/articles", () => {
    it('GET "/" should return all articles as an object with comment counts included', () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]).to.have.keys(
            "title",
            "body",
            "belongs_to",
            "__v",
            "votes",
            "created_by",
            "_id",
            "comments"
          );
          expect(res.body.articles[0].comments).to.equal(2);
        });
    });

    it('GET "/:article_id" should return an object with matching id number and comment count', () => {
      const { _id, title, belongs_to } = articles[0];

      return request
        .get(`/api/articles/${_id}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.be.an("Object");
          expect(res.body.title).to.equal(title);
          expect(res.body.belongs_to).to.equal(belongs_to);
          expect(res.body.comments).to.equal(2);
        });
    });

    it('GET "/:article_id" returns a 404 with message if passed a techincally valid article id format which does not exist', () => {
      return request
        .get("/api/articles/1b1cfd3f0790e1727a9eec3b")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("404 - Page Not Found");
        });
    });

    it('GET "/:article_id" returns a 400 with message if passed an invalid id', () => {
      return request
        .get("/api/articles/veryIncorrectInput")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
        });
    });

    it('GET "/:article_id/comments" returns all the comments for an article', () => {
      const { _id } = articles[0];
      return request
        .get(`/api/articles/${_id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.comments[0].body).to.equal(
            "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works."
          );
          expect(res.body.comments[0].votes).to.equal(7);
        });
    });

    it('GET "/:article_id/comments" returns a 400 with message if passed an invalid id', () => {
      return request
        .get("/api/articles/someVeryIncorrectInput/comments")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
        });
    });

    it('GET "/:article_id/comments" returns an empty array if no comments found', () => {
      return request
        .get("/api/articles/1b1cfd3f0790e1727a9eec3b/comments")
        .expect(200)
        .then(res => {
          expect(res.body.comments).to.eql([]);
        });
    });

    it('POST "/:article_id/comments" should add an comment doc to the relevant article and return a 201 + the new article for correct input defaulting to guest user for created_by', () => {
      const { _id } = articles[0];
      return request
        .post(`/api/articles/${_id}/comments`)
        .send({ comment: "Backend is great!" })
        .expect(201)
        .then(res => {
          expect(res.body.body).to.equal("Backend is great!");
          expect(res.body.votes).to.equal(0);
          expect(res.body.belongs_to).to.equal(`${_id}`);
          const guestUserId = `${users[2]._id}`;
          expect(res.body.created_by).to.equal(guestUserId);
          return request.get(`/api/articles/${_id}/comments`).expect(200);
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(3);
        });
    });

    it('POST "/:article_id/comments" should return 400 with message if no comment key in body and not add article', () => {
      const { _id } = articles[0];
      return request
        .post(`/api/articles/${_id}/comments`)
        .send({})
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
          return request.get(`/api/articles/${_id}/comments`).expect(200);
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(2);
        });
    });

    it('POST "/:article_id/comments" should return 400 with message if not valid article id', () => {
      return request
        .post(`/api/articles/Incorrect/comments`)
        .send({ comment: "Backend is great!" })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
        });
    });

    it('PUT "/:article_id?vote=up" will increase the votecount of an article by one and return updated object', () => {
      const { _id, votes, title } = articles[0];
      return request
        .put(`/api/articles/${_id}?vote=up`)
        .expect(201)
        .then(res => {
          expect(res.body.title).to.equal(title);
          expect(res.body.votes).to.equal(votes + 1);
        });
    });

    it('PUT "/:article_id?vote=down" will decrease the votecount of an article by one and return updated object', () => {
      const { _id, votes, title } = articles[0];
      return request
        .put(`/api/articles/${_id}?vote=down`)
        .expect(201)
        .then(res => {
          expect(res.body.title).to.equal(title);
          expect(res.body.votes).to.equal(votes - 1);
        });
    });

    it('PUT "/:article_id?vote=somethingelse" (ie any vote query which is not up or down) will return 201 and the article unchanged', () => {
      const { _id, votes, title } = articles[0];
      return request
        .put(`/api/articles/${_id}?vote=somethingelse`)
        .expect(201)
        .then(res => {
          expect(res.body.votes).to.equal(votes);
          expect(res.body.title).to.equal(title);
        });
    });

    it('PUT "/:article_id?vote=up" will return a 400 for an invalid id', () => {
      return request
        .put(`/api/articles/notAnArticleId?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
        });
    });

    it('PUT "/:article_id?vote=up" will return a 404 a technically valid article id which does not exist', () => {
      return request
        .put(`/api/articles/1b1cfd3f0790e1727a9eec3b?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("404 - Page Not Found");
        });
    });
  });

  describe("/comments", () => {
    it('PUT "/coments:comment_id?vote=up" will increase the votecount of an comment by one and return updated comment', () => {
      const { _id, votes, body } = comments[0];
      return request
        .put(`/api/comments/${_id}?vote=up`)
        .expect(201)
        .then(res => {
          expect(res.body.body).to.equal(body);
          expect(res.body.votes).to.equal(votes + 1);
        });
    });

    it('PUT "/coments:comment_id?vote=down" will decrease the votecount of an comment by one and return updated comment', () => {
      const { _id, votes, body } = comments[0];
      return request
        .put(`/api/comments/${_id}?vote=down`)
        .expect(201)
        .then(res => {
          expect(res.body.body).to.equal(body);
          expect(res.body.votes).to.equal(votes - 1);
        });
    });

    it('PUT "/:comment_id?vote=somethingelse" (ie any vote query which is not up or down) will return 201 and the comment unchanged', () => {
      const { _id, votes, body } = comments[0];
      return request
        .put(`/api/comments/${_id}?vote=somethingelse`)
        .expect(201)
        .then(res => {
          expect(res.body.body).to.equal(body);
          expect(res.body.votes).to.equal(votes);
        });
    });

    it('PUT "/:comment_id?vote=up" will return a 400 for an invalid id', () => {
      return request
        .put(`/api/comments/notACommentId?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
        });
    });

    it('DELETE "/:comment_id" will delete comment from the db and return 204 & an empty object', () => {
      const { _id, belongs_to } = comments[0];
      return request
        .delete(`/api/comments/${_id}`)
        .expect(204)
        .then(res => {
          expect(res.body).to.eql({});
          return request
            .get(`/api/articles/${belongs_to}/comments`)
            .expect(200);
        })
        .then(res => {
          expect(res.body.comments.length).to.equal(1);
        });
    });

    it('DELETE "/:comment_id" will return a 400 if invalid id', () => {
      return request
        .delete("/api/comments/incorrectID")
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal("Bad Request");
        });
    });
  });

  describe("/users", () => {
    it('GET "/" should return all users as an object', () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(res => {
          expect(res.body.users.length).to.equal(3);
          expect(res.body.users[0]).to.have.keys(
            "username",
            "name",
            "avatar_url",
            "_id",
            "__v"
          );
        });
    });

    it('GET "/:username" returns an object with the profile data for the specified user.', () => {
      return request
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(res => {
          expect(res.body.username).to.equal("butter_bridge");
          expect(res.body.name).to.equal("jonny");
          expect(res.body.avatar_url).to.equal(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
        });
    });

    it('GET "/:username" returns a 404 with message if passed an id which does not exist', () => {
      return request
        .get("/api/users/notARealUsername")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("404 - Page Not Found");
        });
    });

    it('GET "/:username/articles" returns all articles belonging to that user with comment count', () => {
      return request
        .get(`/api/users/butter_bridge/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].comments).to.equal(2);
        });
    });

    it('GET "/:username/articles" returns a 404 with message if passed an username which does not exist', () => {
      return request
        .get("/api/users/notARealUsername/articles")
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("404 - Page Not Found");
        });
    });
  });
});
