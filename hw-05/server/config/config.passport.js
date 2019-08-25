const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dataService = require('../services/dataService');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const user = dataService.findUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use(
  new LocalStrategy(
    function (username, password, done) {
      dataService.findUserByLogin(username).then(function (user) {
        if (!user) {
          return done(null, false);
        }
        if (!user.validatePasswordHash(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      })
        .catch(err => done(err));
    })
);
