const router =require("express").Router()
const { updateArticleVotes, deleteComment} = require('../controllers/comment-controller')

router.route('/:comment_id')
  .put(updateArticleVotes)
  .delete(deleteComment)

module.exports = router;

