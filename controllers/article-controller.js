const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

exports.getArticles = (req, res, next) => {
  Article.find()
  .populate('created_by', 'username')
  .then( articles => {
    res.send({articles})
  })
  .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params;
  return Article.findById(article_id)
  .populate('created_by', 'username')
  .then( article => {
    if(!article) return next({status:404})
    res.send(article)
  })
  .catch(err => {
    console.log(err.name, '***********************')
    if(err.name === 'CastError') next({status: 400})
    else next({status: 500})
    console.log(err)
  })
}

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  return ArticleComment.find({belongs_to: {$eq: article_id}})
  .populate('created_by', 'username')
  .then (comments => {
    if(!comments) return next({status:404})
    res.send({comments})
  })
}

exports.addCommentToArticle = (req, res, next) => {
  return User.findOne({username: {$eq: 'guest'}})
  .then (guest => {
    const newComment = {
      body: req.body.comment,
      created_by: req.body.username ? req.body.username : guest._id,
      belongs_to: req.params.article_id
    }
    return ArticleComment.create(newComment)
  })
  .then( commentDoc => {
    return res.status(201).send(commentDoc)
  })
  .catch(err => {
    if(err.name === 'CastError' || err.name === 'ValidationError') next({status: 400})
    else next({status: 500})
  })
}

exports.updateArticleVotes = (req, res, next) => {
  const {article_id} = req.params;
  const {vote} = req.query
  let voteChange = 0;
  if(vote === 'up') voteChange++
  if(vote === 'down') voteChange--

  return Article.findByIdAndUpdate(article_id, {$inc: {votes: voteChange}}, {new: true})
  .then( article => {
    if(!article) return next({status:404})
    return res.status(201).send(article)
  })
  .catch(err => {
    if(err.name === 'CastError') next({status: 400})
    else next({status: 500})
  })
}