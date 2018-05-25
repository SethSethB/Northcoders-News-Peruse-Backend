module.exports = {

  'GET /api': 'Returns list of available end points',
  
  'GET /api/topics': 'Returns list of all topics',

  'GET /api/topics/:topic/articles' : 'Returns all articles for a given topic slug',

  'POST /api/topics/:topic/articles' : 'Posts a new article for a given topic slug. Posts should be a JSON object with keys "title" and "body", will default to posting as guest',

  'GET /api/articles' : 'Returns all articles',

  'GET /api/articles/:article_id' : 'Returns article for a given id',

  'GET /api/articles/:article_id/comments' : 'Returns all comments for a given article id',

  'POST /api/articles/:article_id/comments' : 'Posts a new comment for a given article id. Posts should be a JSON object with key "comment", will default to posting as guest',

  'PUT /api/articles/:article_id' : 'Updates votes property of given article id, valid queries are ?vote=up (increses votes by one) and ?vote=down (decreased vote by one)',

  'PUT /api/comments/:comment_id' : 'Updates votes property of given comment id, valid queries are ?vote=up (increses votes by one) and ?vote=down (decreased vote by one)',

  'DELETE /api/comments/:comment_id' : 'delete given comment based on id, returns an empty object',

  'GET /api/users/' : 'Returns list of all users',

  'GET /api/users/:username' : 'Returns user profile for a given username',

  'GET /api/users/:username/articles' : 'Returns list of all articles posted by given username'
  
}