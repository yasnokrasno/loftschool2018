module.exports.index = async ctx => {
  ctx.render('pages/index');
};
module.exports.admin = async ctx => {
  ctx.render('pages/admin');
};
module.exports.login = async ctx => {
  ctx.render('pages/login');
};
