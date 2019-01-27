const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(
  session({
    secret: 'loftschoolHW3',
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

app.use('/', require('./routes/index'));

app.use(function (err, req, res, next) {
  if (!err) {
    err = new Error('Not Found');
    err.status = 404;
  }
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {err});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
