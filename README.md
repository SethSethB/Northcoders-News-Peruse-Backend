# Northcoders News

Northcoders News is a news aggregation and rating site which allows you to:
- Read and post articles based on topic.
- Comment on articles (and delete your comment if you change your mind...)
- Vote for (and against!) previously posted articles and comments.

# API

There is a live link for the RESTful API [here](https://seth-northcoders-news.herokuapp.com/api/) which details available routes and methods available.

### Prerequisites

You will need [node](https://docs.npmjs.com/getting-started/installing-node) and [mongo](https://docs.mongodb.com/manual/installation/) installed, please follow the links for instructions on how to do this.

## Getting Started & Installation

Clone this repository with the following terminal command:
```
git clone https://github.com/SethSethB/BE-FT-northcoders-news.git
```
In the BE-FT-northcoders-news directory run the following command to install all dependencies:
```
npm i
```
In order to run the enviroment locally you will need to have mongod running, enter the following in a separate shell to run as a background process:
```
mongod
```

You will now be able to launch the api locally with the command:
```
npm run dev
```

This will automatically seed the dev database locally with the dev data included in this repo.

The dev enviroment will default to serve the api on port 9090 and connect to the local dev database. [Nodemon](https://nodemon.io/) will automatically restart the server if you save any changes in the codebase.

You should be able to access the api in your browser:
```
http://localhost:9090/api
```

For example, accessing the below should return all 36 articles:
http://localhost:9090/api/articles

## Testing

There is a full test suite available which tests all routes and methods on the api. You can run the tests with the following command:
```
npm test
```
This will automatically connect/disconnect to the dev database and re-seed before each test.

## Routes
  "GET /api": "Returns list of available end points",
  "GET /api/topics": "Returns list of all topics",
  "POST /api/topics": "Posts a new topic. Post should be a JSON object with key \"title\", cannot post a topic which already exists",
  "GET /api/topics/:topic/articles": "Returns all articles for a given topic slug",
  "POST /api/topics/:topic/articles": "Posts a new article for a given topic slug. Posts should be a JSON object with keys \"title\" and \"body\", will default to posting as guest. If topic does not already exist, will create new Topic doc",
  "GET /api/articles": "Returns all articles",
  "GET /api/articles/:article_id": "Returns article for a given id",
  "GET /api/articles/:article_id/comments": "Returns all comments for a given article id",
  "POST /api/articles/:article_id/comments": "Posts a new comment for a given article id. Posts should be a JSON object with key \"comment\", will default to posting as guest",
  "PUT /api/articles/:article_id": "Updates votes property of given article id, valid queries are ?vote=up (increses votes by one) and ?vote=down (decreased vote by one)",
  "PUT /api/comments/:comment_id": "Updates votes property of given comment id, valid queries are ?vote=up (increses votes by one) and ?vote=down (decreased vote by one)",
  "DELETE /api/comments/:comment_id": "delete given comment based on id, returns an empty object",
  "GET /api/users/": "Returns list of all users",
  "GET /api/users/:username": "Returns user profile for a given username",
  "GET /api/users/:username/articles": "Returns list of all articles posted by given username"

## Built With

* Express
* MongoDB
* Mongoose
* Mocha
* Chai
* Supertest

## Acknowledgments

A big thank you to all the usual excellent support and feedback from all the Northcoders team.
