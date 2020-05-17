'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const config = require('config');
const serverEnv = process.env.NODE_ENV || 'dev';
let apiBasePath = config.get('server.apiBaseRoot') || '/api';
const morgan = require('morgan');
const http = require('http').Server(app);
const Core = require('./server/classes/core');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * Connect to MongoDB
 */
const db = Core.dbConnect();
app.db = db;

/**
 * Add compression
 */
let shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
};

/**
 * Session storage, in production it should be saved in a MongoDB Collection
 */
const sess = {
  secret: config.get('security.secret'),
  cookie: {},
  store: new MongoStore({
    autoRemove: 'interval',
    autoRemoveInterval: 10, // In minutes. Default
    collection: 'sessions',
    mongooseConnection: db.connection
  }),
  resave: true,
  saveUninitialized: true
}

if (serverEnv === 'production') {
  // Compression
  app.use(compression({filter: shouldCompress}))
  // Sessions
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = config.get('server.sslEnabled'); // serve secure cookies
}

app.use(session(sess));

/**
 * Allow CORS
 */
app.use(cors());

if(serverEnv !== 'production'){
  app.use(morgan('dev'));
}// end if

app.get(apiBasePath+'/version', Core.noCache, function(req, res){
  var version = require('./package.json').version;
  var data = {
    version
  }
  res.json(data);
});

/**
 * API routes
 */
const blogRoutes = require('./server/routes/posts')(app, express);
const authorRoutes = require('./server/routes/authors')(app, express);
/**
 * Assign the API routes to the main app
 */
app.use(apiBasePath, blogRoutes);
app.use(apiBasePath, authorRoutes);

/**
 * Start the server
 */
http.listen(config.get('server.port'), config.get('server.host'), function(){
  console.log(`Server started at the address ${config.get('server.host')}:${config.get('server.port')}`);
})

module.exports = app;