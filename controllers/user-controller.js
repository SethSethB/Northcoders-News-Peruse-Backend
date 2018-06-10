const mongoose = require("mongoose");
const { Article, ArticleComment, Topic, User } = require("../models");

const {
  findCommentCounts,
  formatArticlesWithCommentCount
} = require("../utils");

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send({ users: users });
    })
    .catch(next);
};

exports.getUserbyUsername = (req, res, next) => {
  const { username } = req.params;
  return User.findOne({ username: { $eq: `${username}` } })
    .then(user => {
      if (!user) return next({ status: 404 });
      res.send(user);
    })
    .catch(next);
};

exports.getArticlesByUser = (req, res, next) => {
  const { username } = req.params;
  return User.findOne({ username: { $eq: username } })
    .then(user => {
      return Article.find({ created_by: user._id })
        .lean()
        .populate("created_by", "username");
    })
    .then(findCommentCounts)
    .then(formatArticlesWithCommentCount)
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};
