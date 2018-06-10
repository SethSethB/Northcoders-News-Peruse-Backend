const router = require("express").Router();

const {
  getUserbyUsername,
  getUsers,
  getArticlesByUser
} = require("../controllers/user-controller");

router.route("/").get(getUsers);

router.route("/:username").get(getUserbyUsername);

router.route("/:username/articles").get(getArticlesByUser);

module.exports = router;
