const router =require("express").Router()

const { getUserbyId, getUsers, getArticlesByUser } = require('../controllers/user-controller')

router.route('/')
  .get(getUsers)

router.route('/:username')
  .get(getUserbyId)

router.route('/:username/articles')
  .get(getArticlesByUser)

module.exports = router;