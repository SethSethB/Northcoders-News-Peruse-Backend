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
        console.log(`Database sucessfully seeded with ${topicDocs.length} topic docs`)
        console.log(`Database sucessfully seeded with ${userDocs.length} user docs`)
        return Promise.all([Article.insertMany(formatArticleData(articleData, userDocs)), userDocs])
    })
    .then(([articleDocs, userDocs]) => {
        console.log(`Database sucessfully seeded with ${articleDocs.length} article docs`)
        return ArticleComment.insertMany(formatCommentData(commentData, articleDocs, userDocs))
    })
    .then(commentDocs => commentDocs)
    .catch( err => console.log(err))
}

module.exports = seedDB