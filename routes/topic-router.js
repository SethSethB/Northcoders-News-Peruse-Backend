const router =require("express").Router()
const {getTopics, getArticlesByTopic, addArticle } = require('../controllers/topic-controller')

router.route('/')
  .get(getTopics)

router.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticle)

module.exports = router;

