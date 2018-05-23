const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models');
const { formatArticleData } = require('../utils')
const dataSet = process.env.NODE_ENV === 'test' ? 'testData' : 'devData';

const articleData = require(`./${dataSet}/articles.json`);
const commentData = require(`./${dataSet}/comments.json`);
const topicData = require(`./${dataSet}/topics.json`);
const userData = require(`./${dataSet}/users.json`);



function seedDB () {
    return mongoose.connection.dropDatabase()
    .then(() => {
        return Promise.all([Topic.insertMany(topicData), User.insertMany(userData)])
    })
    .then(([topicDocs, userDocs]) => {
        return Article.insertMany(formatArticleData(articleData, userDocs))
    })
    .then((articleDocs) => {
        console.log(articleDocs)
    })
  

//SEED ARTICLES


//SEED COMMENTS

//CATCH
}

module.exports = seedDB