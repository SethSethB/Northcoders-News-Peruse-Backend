const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

exports.updateCommentVotes = (req, res, next) => {
  const {comment_id} = req.params;
  const {vote} = req.query
  let voteChange = 0;
  if(vote === 'up') voteChange++
  if(vote === 'down') voteChange--

  return ArticleComment.findByIdAndUpdate(comment_id, {$inc: {votes: voteChange}}, {new: true})
  .then(comment => {
    if(vote !== 'up' && vote !== 'down') return next({status: 400})
    res.status(200).send(comment)
  })
  .catch(err => {
    if(err.name === 'CastError') next({status: 404})
    else next({status: 500})
  })
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;
  ArticleComment.findByIdAndRemove(comment_id)
  .then( removedComment => {
    if(!removedComment) return next({status:404})
    res.status(204).send({})
  })
  .catch(err => {
    if(err.name === 'CastError') next({status: 404})
    else next({status: 500})
  })
}



