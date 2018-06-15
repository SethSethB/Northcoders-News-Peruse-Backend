const mongoose = require("mongoose");
const { Article, ArticleComment, Topic, User } = require("../models");
const {
  findCommentCounts,
  formatArticlesWithCommentCount
} = require("../utils");

exports.getArticles = (req, res, next) => {
  Article.find()
    .lean()
    .populate("created_by")
    .then(findCommentCounts)
    .then(formatArticlesWithCommentCount)
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id))
    return next({ status: 400 });
  return Article.findById(article_id)
    .lean()
    .populate("created_by")
    .then(article => {
      return findCommentCounts([article]);
    })
    .then(formatArticlesWithCommentCount)
    .then(([article]) => {
      res.send({ ...article });
    })
    .catch(err => {
      next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.belongs_to))
    return next({ status: 400 });

  return ArticleComment.find(req.params)
    .lean()
    .populate("created_by", "username")
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => {
      if (err.name === "CastError") next({ status: 400 });
      else next(err);
    });
};

exports.addCommentToArticle = (req, res, next) => {
  const { comment } = req.body;
  const { belongs_to } = req.params;

  if (!comment || !mongoose.Types.ObjectId.isValid(belongs_to))
    return next({ status: 400 });

  return User.findOne({ username: "guest" })
    .then(guest => {
      const newComment = {
        body: comment,
        created_by: req.body.username ? req.body.username : guest._id,
        belongs_to
      };
      return ArticleComment.create(newComment);
    })
    .then(commentDoc => {
      res.status(201).send(commentDoc);
    })
    .catch(err => {
      if (err.name === "TypeError") next({ status: 404 });
      else next(err);
    });
};

exports.updateArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(article_id))
    return next({ status: 400 });

  const { vote } = req.query;
  let voteChange = 0;
  if (vote === "up") voteChange++;
  if (vote === "down") voteChange--;

  return Article.findByIdAndUpdate(
    article_id,
    { $inc: { votes: voteChange } },
    { new: true }
  )
    .then(article => {
      if (!article) return next({ status: 404 });
      res.status(201).send(article);
    })
    .catch(next);
};
