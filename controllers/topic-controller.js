const mongoose = require("mongoose");
const { Article, ArticleComment, Topic, User } = require("../models");

const {
  formatArticleTopics,
  findCommentCounts,
  formatArticlesWithCommentCount,
  insertTopic
} = require("../utils");

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  return Article.find({ belongs_to: { $eq: topic } })
    .lean()
    .populate("created_by")
    .then(findCommentCounts)
    .then(formatArticlesWithCommentCount)
    .then(articles => {
      if (!articles.length) return next({ status: 404 });
      res.send({ articles });
    })
    .catch(next);
};

exports.addArticle = (req, res, next) => {
  if (!req.body.title || !req.body.body) return next({ status: 400 });

  const username = req.body.username || "guest";

  return User.findOne({ username: { $eq: username } })
    .then(user => {
      const newArticle = {
        ...req.body,
        created_by: user._id,
        belongs_to: req.params.topic.toLowerCase()
      };

      return Article.create(newArticle);
    })
    .then(articleDoc => {
      res.status(201).send(articleDoc);
      return articleDoc.belongs_to;
    })
    .then(articleTopic => {
      return Topic.findOne({ slug: articleTopic });
    })
    .then(existingTopic => {
      if (!existingTopic) insertTopic(req.params.topic);
    })
    .catch(next);
};

exports.addTopic = (req, res, next) => {
  const { title } = req.body;

  if (!title) return next({ status: 400 });

  insertTopic(req.body.title)
    .then(topic => {
      res.status(201).send(topic);
    })
    .catch(next);
};
