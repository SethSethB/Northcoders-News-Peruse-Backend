const mongoose = require('mongoose')
const { Article, ArticleComment, Topic, User } = require('../models');

exports.getUserbyId = (req, res, next) => {
  // const {username} = req.params;
  // return User.findOne({username: {$eq: `${username}`}})
  // .then( user => {
  //   if(!article) return next({status:404})
  //   res.send(user)
  // })
  // .catch(err => {
  //   if(err.name === 'CastError') next({status: 400})
  //   else next({status: 500})
  // })
}