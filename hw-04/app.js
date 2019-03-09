const Koa = require('koa');
const stat = require('koa-static');
const Pug = require('koa-pug');
const router = require('./routes');
const errorHandler = require('./libs/error');

const app = new Koa();
const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true, // должен стоять флаг в зависимости от стенда.
  app: app
});

app.use(stat('./public'));
app.use(errorHandler);
app.on('error', (err, ctx) => {
  ctx.render('pages/error', {
    status: ctx.response.status,
    message: ctx.response.message
  });
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
