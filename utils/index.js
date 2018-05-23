
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
