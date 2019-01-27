const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname, '..', 'data.json'));
const db = low(adapter);

module.exports.getIndex = function (req, res, next) {
  renderIndex(res);
};
module.exports.postIndex = function (req, res, next) {
  renderIndex(res, {
    popupMessage: {
      title: 'Сообщение отправлено!',
      message:`Благодарю тебя, ${req.body.name}! Я отвечу, как только освобожусь.`
    }
  });
};

function getIndexData () {
  db.read();
  const products = db.get('products').value();
  const skills = db.get('skills').value();
  return {products, skills};
}
function renderIndex (res, extraVars = {}) {
  const indexData = getIndexData();
  res.render('pages/index', {products: indexData.products, skills: indexData.skills, ...extraVars});
}
