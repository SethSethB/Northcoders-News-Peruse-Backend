const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

const { formatArticleTopics } = require('../utils')

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then( topics => {
      res.send({topics: topics})
    })
    .catch(next)
}

exports.getArticlesByTopic = (req, res, next) => {
  const {topic} = req.params;
  return Article.find({belongs_to: {$eq: topic}})
  .populate('created_by', 'username')
  .then( articles => {
    articles.map(article => {
      return ArticleComment.count({belongs_to: {$eq: article._id}})
      .then(comments => {
        return {
          ...article,
          comments
        }
      })
      .then(articlesWithComments =>{
        console.log(articlesWithComments.length)
        return res.send({articles: articlesWithComments})
      })
   })
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