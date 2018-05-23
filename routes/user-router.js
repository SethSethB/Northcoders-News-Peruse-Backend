const router =require("express").Router()

const {getUserbyId } = require('../controllers/user-controller')

router.route('/:username')
  .get(getUserbyId)

module.exports = router;