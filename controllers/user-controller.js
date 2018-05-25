const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

const { findCommentCounts, formatArticlesWithCommentCount } = require('../utils')

exports.getUsers = (req, res, next) => {
  User.find()
    .then( users => {
      res.send({users: users})
    })
    .catch(next)
}

exports.getUserbyId = (req, res, next) => {
  const {username} = req.params;
  return User.findOne({username: {$eq: `${username}`}})
  .then( user => {
    if(!user) return next({status:404})
    res.send(user)
  })
  .catch(err => {
    if(err.name === 'CastError') next({status: 404})
    else next({status: 500})
  })
}

exports.getArticlesByUser = (req, res, next) => {
  const {username} = req.params;
  return User.findOne({username: {$eq: username}})
  .then( user => {
    return Article.find({created_by: user._id}).lean().populate('created_by', 'username')
  })
  .then(findCommentCounts)
  .then(formatArticlesWithCommentCount)
  .then(articles => {
    res.send({articles})
  })
  .catch(err => {
    if(err.name === 'CastError' || err.name == 'TypeError') next({status: 404})
    else next({status: 500})
  })
}