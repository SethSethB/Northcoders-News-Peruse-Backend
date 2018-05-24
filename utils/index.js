const { Article, ArticleComment, Topic, User } = require('../models');

exports.formatArticleData = (rawArticleData, userDocs) => {
  return rawArticleData.map( article => {
    return {
      ...article,
      created_by: userDocs.find(user => user.username === article.created_by)._id,
      belongs_to: article.topic
    }
  })
};

exports.formatCommentData = (commentData, articleDocs, userDocs) => {
  return commentData.map ( comment => {
    return {
      ...comment,
      belongs_to: articleDocs.find(article => article.title === comment.belongs_to)._id,
      created_by: userDocs.find(user => user.username === comment.created_by)._id
    }
  })
}

exports.findCommentCounts = (articles) => {
  const commentCounts = articles.map(article => ArticleComment.count({belongs_to: {$eq: article._id}}))
  return Promise.all([articles, ...commentCounts])
}

exports.formatArticlesWithCommentCount = ([articles, ...articlesCommentCounts]) => {

  return articlesWithCommentCount = articles.map( (article, index) => {
    // console.log(article)
    return {
      ...article,
      created_by: article.created_by.username,
      comments: articlesCommentCounts[index]
    }
  })
}

