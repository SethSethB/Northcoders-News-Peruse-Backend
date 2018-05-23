const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

exports.getArticles = (req, res, next) => {
  console.log('Hi')
  Article.find()
  .then( articles => {
    res.send({articles})
  })
  .catch(next)
}