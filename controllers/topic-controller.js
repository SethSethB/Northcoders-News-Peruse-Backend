const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

const { formatArticleTopics, findCommentCounts, formatArticlesWithCommentCount } = require('../utils')

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then( topics => {
      res.send({topics: topics})
    })
    .catch(next)
}

exports.getArticlesByTopic = (req, res, next) => {
  const {topic} = req.params;
  return Article.find({belongs_to: {$eq: topic}}).lean()
  .populate('created_by', 'username')
  .then(findCommentCounts)
  .then(formatArticlesWithCommentCount)
  .then(articles => {
    if(articles.length === 0) return next({status: 404})
    res.send({articles})
  })
  .catch(next)
}

exports.addArticle = (req, res, next) => {
  return User.findOne({username: {$eq: 'guest'}})
  .then (guest => {
    const newArticle = {
      ...req.body,
      created_by: req.body.username ? req.body.username : guest._id,
      belongs_to: req.params.topic
    }
    return Article.create(newArticle)
  })
  .then( articleDoc => {
    res.status(201).send(articleDoc)
  })
  .catch(err => {
    if(err.name === 'ValidationError') next({status: 400})
    else next({status: 500})
  })
}