const fs = require('fs');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname, '..', 'data.json'));
const db = low(adapter);
const formidable = require('formidable');

module.exports.getAdmin = function (req, res, next) {
  renderAdmin(res);
};
module.exports.isAdmin = function (req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
};
module.exports.postAdminSkills = function (req, res, next) {
  db.set('skills.age.number', +req.body.age).write();
  db.set('skills.concerts.number', +req.body.concerts).write();
  db.set('skills.cities.number', +req.body.cities).write();
  db.set('skills.years.number', +req.body.years).write();
  res.redirect('/admin?msg=skills_updated');
};
module.exports.postAdminProduct = function (req, res, next) {
  let form = new formidable.IncomingForm();
  const uploadPath = path.join(process.cwd(), 'hw-03', 'public', 'assets', 'img', 'products');
  form.uploadDir = uploadPath;

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = fileValidation(files);
    if (!valid) {
      fs.unlinkSync(files.photo.path);
      return res.redirect('/admin?msg=error1');
    }

    const fileName = path.join(uploadPath, files.photo.name);
    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        fs.unlink(files.photo.path);
        return res.redirect('/admin?msg=error2');
      }

      db.get('products')
        .push({
          src: `./assets/img/products/${files.photo.name}`,
          name: fields.name,
          price: +fields.price
        })
        .write();
      return res.redirect('/admin?msg=product_created');
    });
  });
};

function renderAdmin (res, extraVars = {}) {
  const vars = {
    skills: db.get('skills').value(),
    ...extraVars
  };
  res.render('pages/admin', vars);
}

const fileValidation = (files) => {
  return !(files.photo.name === '' || files.photo.size === 0);
};
