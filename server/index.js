import path from 'path'
import Koa from 'koa'
import Static from 'koa-static'
import R from 'ramda'
import chalk from 'chalk'
import config from '../config'

const MIDDLEWARES = ['database', 'general', 'router', 'redirect']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => path.join(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES)
}

async function start () {
  const app = new Koa()
  const { port } = config

  await useMiddlewares(app)
  if (process.env.NODE_ENV !== 'development') {
    app.use(Static(
      path.join( __dirname, '../dist' )
    ))
    app.use(async (ctx, next)=> {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
      ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
      } else {
        await next();
      }
    });
  }


  const server = app.listen(port, () => {
    console.log(
      process.env.NODE_ENV === 'development'
        ? `Open ${chalk.green('http://localhost:' + port)}`
        : `App listening on port ${port}`
    )
  })
}

start()
