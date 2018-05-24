const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

const { formatArticleTopics, findCommentCount } = require('../utils')

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
  .then( articles => {
    const commentCounts = articles.map(findCommentCount)
    return Promise.all([articles, ...commentCounts])
  })  
  .then(([articles, ...articlesCommentCounts]) => {
    const articlesWithCommentCount = articles.map( (article, index) => {
      console.log(article)
      return {
        ...article,
        comments: articlesCommentCounts[index]
      }
    })
    res.send({articlesWithCommentCount})
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
    return res.status(201).send(articleDoc)
  })
  .catch(err => {
    if(err.name === 'ValidationError') next({status: 400})
    else next({status: 500})
    console.log(err)
  })
}