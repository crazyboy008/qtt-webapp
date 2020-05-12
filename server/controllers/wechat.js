import * as wechat from '../api/wechat'
import * as User from '../api/user'
import config from '../../config'
import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'

export async function signature (ctx, next) {
  let url = ctx.query.url

  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)
  let params = await wechat.getSignatureAsync(url)

  ctx.body = {
    success: true,
    data: params
  }
}

// 网页上点某按钮，直接跳转到 http://x.o/wechat-redirect?visit=a&id=b
// 用户被重定向到 Wechat Redirect URL 授权验证
// 验证后，自动二跳进入 http://x.o/oauth?code=xxxxxx&state=a_b
export async function redirect (ctx, next) {
  let redirect = config.SITE_ROOT_URL + '/login'
  let scope = 'snsapi_userinfo'
  const { visit } = ctx.query
  const params = visit ? visit : ''

  const url = wechat.getAuthorizeURL(scope, redirect, params)
  // ctx.status = 301
  // ctx.redirect(url)
  ctx.status = 200
  ctx.body = {
    status: 'success',
    msg: '',
    result: url
  }
}

export async function oauth (ctx, next) {
  const url = ctx.query.url
  const urlObj = urlParse(decodeURIComponent(url))
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await wechat.getUserByCode(code)
  console.log(user)
  if (user.openid) {
    await User.saveDBUserAsync(user)
    ctx.session = {
      openid: user.openid
    }
    ctx.body = {
      status: 'success',
      msg: '',
      result: user
    }
  } else {
    ctx.body = {
      status: 'error',
      msg: '授权失败',
      result: user
    }
  }
}
