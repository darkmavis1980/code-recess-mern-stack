const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const Author = require('../models/authors');

module.exports = (app, express) => {
  // create the API routes
  let routes = express.Router();

  routes.get('/authors', jsonParser, async (req, res) => {
    const results = await Author
      .find()
      .lean()
      .exec();
    res
      .status(200)
      .json(results);
  });

  routes.post('/authors', jsonParser, async (req, res) => {
    const {
      firstname,
      lastname,
      email
    } = req.body;
    const author = new Author({
      firstname,
      lastname,
      email
    });

    const data = await author.save();
    res
      .status(200)
      .json(data);
  });
  return routes;
}