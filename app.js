'use strict';

require('dotenv').config();

// set up Express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const logger = require('morgan');

// start express
const app = express();

// set up flash error messaging
const session = require('express-session');

// store mongo session
const MongoStore = require('connect-mongo')(session);

// set up connection to mongo database
const mongoose = require('mongoose');

// set up flash messages
const flash = require('connect-flash');

// set up the routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const sessionRouter = require('./routes/sessions');

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

// store session and create currentUser
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
hbs.registerPartials(path.join(__dirname, '/views/partials'));

app.use(express.static(path.join(__dirname, 'public')));

// use flash
app.use(flash());

// default route handlers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/sessions', sessionRouter);

// 404 client error handler
app.use((req, res, next) => {
  res.status(404);
  res.render('not-found', { title: 'Page not found! | Playvine ' });
});

// 500 server error handler
app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error', { title: 'Server Error, sorry | Playvine ' });
  }
});

module.exports = app;
