const router = require("express").Router();
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const apiRoutesRef = require('../api_homepage')


router.get("/", (req, res, next) => {
  res.send(apiRoutesRef)
});

router.use("/topics", topicRouter);
router.use("/articles", articleRouter);
router.use("/comments", commentRouter);
router.use("/users", userRouter);

router.get("/*", (req, res, next) => {
  next({ status: 404 });
});

module.exports = router;
