const router =require("express").Router()
const {getTopics, getArticlesByTopic, addArticle, addTopic } = require('../controllers/topic-controller')

router.route('/')
  .get(getTopics)
  .post(addTopic)

router.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(addArticle)

module.exports = router;

