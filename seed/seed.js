const mongoose = require('mongoose');
const { Article, ArticleComment, Topic, User } = require('../models');
const { formatArticleData, formatCommentData } = require('../utils')
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
        return Promise.all([Article.insertMany(formatArticleData(articleData, userDocs)), userDocs, topicDocs])
    })
    .then(([articleDocs, userDocs, topicDocs]) => {
        return Promise.all([ArticleComment.insertMany(formatCommentData(commentData, articleDocs, userDocs)), articleDocs, userDocs, topicDocs])
    })
    .then(docs => docs)
    .catch( err => console.log(err))
}

module.exports = seedDB