const mongoose = require("mongoose");
const { Article, ArticleComment, Topic, User } = require("../models");

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(comment_id))
    return next({ status: 400 });

  const { vote } = req.query;
  let voteChange = 0;
  if (vote === "up") voteChange++;
  if (vote === "down") voteChange--;

  return ArticleComment.findByIdAndUpdate(
    comment_id,
    { $inc: { votes: voteChange } },
    { new: true }
  )
    .then(comment => {
      if (!comment) return next({ status: 404 });
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(comment_id))
    return next({ status: 400 });

  ArticleComment.findByIdAndRemove(comment_id)
    .then(removedComment => {
      if (!removedComment) return next({ status: 404 });
      res.status(204).send({});
    })
    .catch(next);
};
