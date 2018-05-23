const router =require("express").Router()
const { getArticles, getArticleById, getArticleComments, addCommentToArticle, updateArticleVotes} = require('../controllers/article-controller')

router.route('/')
  .get(getArticles)

router.route('/:article_id')
  .get(getArticleById)
  .put(updateArticleVotes)

router.route('/:article_id/comments')
  .get(getArticleComments)
  .post(addCommentToArticle)

module.exports = router;