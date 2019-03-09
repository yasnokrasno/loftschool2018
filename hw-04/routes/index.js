const Router = require('koa-router');
const koaBody = require('koa-body');
const controllers = require('../controllers');
const router = new Router();

router.get('/', controllers.index);
router.get('/login', controllers.login);
router.get('/admin', controllers.admin);

module.exports = router;
