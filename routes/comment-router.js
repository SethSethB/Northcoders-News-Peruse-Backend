const router =require("express").Router()
const { updateCommentVotes, deleteComment} = require('../controllers/comment-controller')

router.route('/:comment_id')
  .put(updateCommentVotes)
  .delete(deleteComment)

module.exports = router;

