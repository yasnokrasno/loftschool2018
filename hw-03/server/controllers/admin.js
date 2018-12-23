module.exports.getAdmin = function (req, res, next) {
  res.render('pages/admin');
};
module.exports.isAdmin = function (req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
};
