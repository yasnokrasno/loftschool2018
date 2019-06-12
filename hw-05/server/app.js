const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes/index');

const app = express();
app.use(bodyParser.text());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  session({
    secret: 'loftschoolHW5',
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
