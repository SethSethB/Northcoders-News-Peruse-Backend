
exports.formatArticleData = (rawArticleData, userDocs) => {
  return rawArticleData.map( article => {

    return {
      ...article,
      created_by: userDocs.find(user => user.username === article.created_by)._id,
      belongs_to: article.topic
    }
  })
}


