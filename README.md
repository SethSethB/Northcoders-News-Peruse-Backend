# Northcoders News

Northcoders News is a news aggregation and rating site which allows you to:
- Read and post articles based on topic
- Comment on articles (and delete your comment if you change your mind...)
- Vote for (and against!) previously posted articles and comments

# API

There is a live link for the RESTful API [here](https://seth-northcoders-news.herokuapp.com/api/) which details available routes and methods available.

## Prerequisites

You will need [node](https://nodejs.org/en/) and [mongo](https://docs.mongodb.com/manual/installation/) installed, please follow the links for instructions on how to do this.

## Getting Started & Installation

Clone this repository with the following terminal command:
```
git clone https://github.com/SethSethB/BE-FT-northcoders-news.git
```
Change into the BE-FT-northcoders-news directory:
```
cd BE-FT-northcoders-news
```
Now run the following command to install all dependencies:
```
npm i
```
## Running the local development env

In order to run the enviroment locally you will need to have mongod running, enter the following in a separate shell to run as a background process:
```
mongod
```

There is some config setup required to sucessfully connect to the local dev/test mongo url, you can run the following command as a shortcut to create & populate the config files:
```
mkdir config ; touch config/dev.config.js ; touch config/test.config.js ; touch config/index.js ; echo "exports.DB_URL = 'mongodb://localhost:27017/northcoders_news';" > config/dev.config.js ; echo "exports.DB_URL = 'mongodb://localhost:27017/northcoders_news_test';" > config/test.config.js ; echo "const path = process.env.NODE_ENV || 'dev';\nmodule.exports = require(\`./\${path}.config.js\`)" > config/index.js

```

You will now be able to launch the api locally with the command:
```
npm run dev
```

This will automatically seed the dev database locally with the dev data included in this repo.

The dev enviroment will default to serve the api on port 9090 and connect to the local dev database. [Nodemon](https://nodemon.io/) will automatically restart the server if you save any changes in the codebase.

You should be able to access the local api in your browser:
```
http://localhost:9090/api
```

For example, accessing the below should return all 36 dev articles:
```
http://localhost:9090/api/articles
```

## Testing

There is a full test-suite available which tests all routes and methods on the api. You can run the tests with the following command:
```
npm test
```
This will automatically connect to the test database, seed the raw test data before each test and disconnect from the test database when complete.

## Built With

* Express
* MongoDB
* Mongoose
* Mocha
* Chai
* Supertest

## Acknowledgments

A big thank you to all the Northcoders team for all the usual excellent support and feedback.
