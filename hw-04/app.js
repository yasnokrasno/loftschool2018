const Koa = require('koa');
const stat = require('koa-static');
const Pug = require('koa-pug');
const router = require('./routes');
const errorHandler = require('./libs/error');
const path = require('path');

const app = new Koa();
const pug = new Pug({
  viewPath: path.join(__dirname, 'views'),
  pretty: false,
  basedir: path.join(__dirname, 'views'),
  noCache: true, // must be a flag depending on the environment
  app: app
});

app.use(stat(path.join(__dirname, 'public')));
app.use(errorHandler);
app.on('error', (err, ctx) => {
  ctx.render('pages/error', {
    status: ctx.response.status,
    message: ctx.response.message
  });
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('Listening localhost:3000...');
