import { resolve } from 'path'
import KoaRouter from 'koa-router'
import glob from 'glob'
import R from 'ramda'

const pathPrefix = Symbol('pathPrefix')
const routeMap = []
let logTimes = 0
let reqID = 0

// const resolvePath = (path) => {
//   const startWith = (/^\/.*/).test(path) // 判断path是否以 / 字段开头
//   return startWith ? path : `/${path}`
// }
const resolvePath = R.unless(
  R.startsWith('/'),
  R.curryN(2, R.concat)('/')
)


// const changeToArr = (arr) => {
//   if (arr instanceof Array) {
//     return arr
//   } else {
//     return [...arr]
//   }
// }
const changeToArr = R.unless(
  R.is(Array),
  R.of
)

export class Route {
  constructor (app, routesPath) {
    this.app = app
    this.router = new KoaRouter()
    this.routesPath = routesPath
  }

  init() {

    glob.sync(resolve(this.routesPath, './*.js')).forEach(require)

    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[pathPrefix])
        this.router[method](prefix + path, ...callback)
      }
    )(routeMap)

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

export const convert = middleware => (target, key, descriptor) => {
  target[key] = R.compose(
    R.concat(
      changeToArr(middleware)
    ),
    changeToArr
  )(target[key])
  return descriptor
}

export const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path: resolvePath(path),
    callback: changeToArr(target[key])
  })
  return descriptor
}

export const Controller = path => target => (target.prototype[pathPrefix] = path)

export const Get = setRouter('get')

export const Post = setRouter('post')

export const Put = setRouter('put')

export const Delete = setRouter('delete')

export const Log = convert(async (ctx, next) => {
  logTimes++
  console.time(`${logTimes}: ${ctx.method} - ${ctx.url}`)
  await next()
  console.timeEnd(`${logTimes}: ${ctx.method} - ${ctx.url}`)
})

/**
 * @Required({
 *   body: ['name', 'password']
 * })
 */
export const Required = paramsObj => convert(async (ctx, next) => {
  let errs = []

  R.forEachObjIndexed(
    (val, key) => {
      errs = errs.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(paramsObj)

  if (!R.isEmpty(errs)) {
    return (
      ctx.body = {
        status: 'error',
        errCode: 412,
        errMsg: `${R.join(', ', errs)} is required`
      }
    )
  }
  await next()
})

export const log = convert(async (ctx, next) => {
  let currentReqID = reqID++
  console.time(`${currentReqID} ${ctx.method} ${ctx.url}`)
  await next()
  console.timeEnd(`${currentReqID} ${ctx.method} ${ctx.url}`)
})

export const Auth = convert(async (ctx, next) => {
  if (!ctx.session.user) {
    return (
      ctx.body = {
        status: 'error',
        errCode: 401,
        errMsg: '登陆信息已失效, 请重新登陆'
      }
    )
  }
  await next()
})
