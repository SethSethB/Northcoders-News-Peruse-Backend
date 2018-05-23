const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

exports.updateArticleVotes = (req, res, next) => {
  const {comment_id} = req.params;
  const {vote} = req.query
  let voteChange = 0;
  if(vote === 'up') voteChange++
  if(vote === 'down') voteChange--

  return ArticleComment.findByIdAndUpdate(comment_id, {$inc: {votes: voteChange}}, {new: true})
  .then(comment => {
    if(!comment) return next({status:404})
    return res.status(201).send(comment)
  })
  .catch(err => {
    if(err.name === 'CastError') next({status: 400})
    else next({status: 500})
  })
}

exports.deleteComment = (req, res, next) => {
  
  // const {comment_id} = req.params;
  // findByIdAndRemove(comment_id)
  // .then( removedComment => {
  //   if(!removedComment) return next({status:404})
  //   return res.send(removedComment)
  // })
  // .catch(err => {
  //   console.log(err)
  //   if(err.name === 'CastError') next({status: 400})
  //   else next({status: 500})
  // })
}
