const path = require('path');
const express = require('express');

const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);

const routes = require('./routes/index');

// todo: make authorization

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'loftschoolHW5', // todo: move to ENV config
    store: new FileStore(),
    key: 'lfsesskey',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null,
    },
    saveUninitialized: false,
    resave: false
  })
);
require('./config/config.passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/', routes);
app.use(function (err, req, res, next) {
  if (!err) {
    err = new Error('Not Found');
    err.status = 404;
  }
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send('error');
});

app.listen(3000, () => console.log('Example hw-05 app listening on port 3000...'));
