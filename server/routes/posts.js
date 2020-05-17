const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (app, express) => {
  // create the API routes
  let routes = express.Router();

  routes.get('/posts', jsonParser, (req, res) => {
    res.send('hello');
  })
  return routes;
}