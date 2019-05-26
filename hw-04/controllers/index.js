const db = require('../models/db');
const fs = require('fs');
const util = require('util');
const _path = require('path');
const pass = require('../libs/password');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

module.exports.index = async ctx => {
  ctx.render('pages/index', {
    products: db.get('products').value() || [],
    skills: db.get('skills').value() || {}
  });
};

module.exports.indexMessage = async ctx => {
  const { name, email, message } = ctx.request.body;
  if (!name || !email) {
    ctx.redirect('/?message_not_sent');
    return;
  }
  console.log('name: ', name, '\nemail: ', email, '\nmessage:\n', message);
  ctx.redirect('/?message_sent');
};

module.exports.admin = async ctx => {
  if (ctx.session.isAdmin) {
    renderAdmin(ctx);
  } else {
    ctx.redirect('/login');
  }
};

module.exports.login = async ctx => {
  if (ctx.session.isAdmin) {
    renderAdmin(ctx);
  } else {
    ctx.render('pages/login');
  }
};

module.exports.loginPost = async ctx => {
  const { email, password } = ctx.request.body;
  const admin = db.get('admin').value();
  if (admin.login === email && pass.checkPassword(password, db.get('passwordSalt').value(), admin.pass)) {
    ctx.session.isAdmin = true;
    ctx.redirect('/admin');
  } else {
    ctx.redirect('/login?wrong_pass');
  }
};

module.exports.uploadProduct = async ctx => {
  const { productname, price } = ctx.request.body;
  const { name, path } = ctx.request.files.photo;
  const fileValid = fileValidation(ctx.request.files);
  if (!fileValid) {
    await unlink(path);
    ctx.redirect('/admin?msg=error1');
  }

  // rename received file
  let fileName = _path.join(__dirname, '..', 'public', 'assets', 'img', 'products', name);
  const renameError = await rename(path, fileName);
  if (renameError) {
    ctx.redirect('/admin?msg=error2');
  }

  // save product
  db.get('products').push({
    src: `./assets/img/products/${name}`,
    name: productname,
    price: price
  }).write();

  ctx.redirect('/admin?msg=product_created');
};

module.exports.adminSkills = async ctx => {
  const { age, concerts, cities, years } = ctx.request.body;
  db.set('skills.age.number', +age)
    .set('skills.concerts.number', +concerts)
    .set('skills.cities.number', +cities)
    .set('skills.years.number', +years)
    .write();
  ctx.redirect('/admin?msg=skills_updated');
};

function renderAdmin (ctx, extraVars = {}) {
  const skills = db.get('skills').value() || {};
  const vars = {
    skills,
    ...extraVars
  };
  ctx.render('pages/admin', vars);
}

function fileValidation (files) {
  return !(files.photo.name === '' || files.photo.size === 0);
}
