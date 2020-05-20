const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Posts = require('../models/posts');

module.exports = (app, express) => {
  // create the API routes
  let routes = express.Router();

  routes.get('/posts', jsonParser, async (req, res) => {
    const results = await Posts
      .find()
      .select('-comments')
      .populate('author', 'firstname lastname -_id')
      .lean()
      .exec();
    res
      .status(200)
      .json(results);
  });

  routes.get('/posts/:id', jsonParser, async (req, res) => {
    const { id } = req.params;
    const results = await Posts
      .findById(id)
      .populate('author', 'firstname lastname -_id')
      .lean()
      .exec();
    res
      .status(200)
      .json(results);
  });

  routes.post('/posts/:id/comments', jsonParser, async (req, res) => {
    const { id } = req.params;
    const { nickname, comment } = req.body;
    try {
      const post = await Posts
        .findById(id)
        .exec();
      post.comments.push({
        nickname,
        comment
      });
      const data = await post.save();
      res
        .status(200)
        .json(data);
    } catch (error) {
      res
        .status(400)
        .json(error);
    }
  });

  routes.post('/posts', jsonParser, async (req, res) => {
    const {
      title,
      message,
      status,
      author
    } = req.body;
    try {
      const post = new Posts({
        title,
        message,
        status,
        author
      });

      const data = await post.save();
      res
        .status(200)
        .json(data);
    } catch (error) {
      res
        .status(400)
        .json(error);
    }
  });

  return routes;
}