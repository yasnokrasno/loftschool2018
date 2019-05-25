const Router = require('koa-router');
const koaBody = require('koa-body');
const controllers = require('../controllers');
const router = new Router();
const path = require('path');

router.get('/', controllers.index);
router.post('/', koaBody(), controllers.indexMessage);
router.get('/login', controllers.login);
router.get('/admin', controllers.admin);
router.post('/admin/skills', koaBody(), controllers.adminSkills);
router.post(
  '/admin/upload',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '..', 'public', 'assets', 'img', 'products')
    },
    formLimit: 1024000
  }),
  controllers.uploadProduct
);

module.exports = router;
