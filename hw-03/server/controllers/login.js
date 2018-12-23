const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync(path.join(__dirname, '..', 'data.json'));
const db = low(adapter);

module.exports.getLogin = function (req, res, next) {
  if (req.session.isAdmin) {
    res.redirect('/admin');
    return;
  }
  res.render('pages/login');
};
module.exports.handleLogin = function (req, res, next) {
  const adminAcc = db.get('admin').value();
  if (adminAcc.login !== req.body.email || adminAcc.pass !== req.body.password) {
    res.render('pages/login', {popupMessage: {title: 'Ошибка авторизации', message: 'Неправильный логин или пароль'}});
    return;
  }
  req.session.isAdmin = true;
  res.redirect('/admin');
};
