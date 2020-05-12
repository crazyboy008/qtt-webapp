import { Controller, Get, Post, log } from '../decorator/router'
import * as wechat from '../controllers/wechat'
// import config from '../../config'
// import reply from '../wechat/reply'
// import wechatMiddle from '../wechat-lib/middleware'

@Controller('/wechat')
export class WxController {
  // @Get('/wechat-hear')
  // @log
  // async wxHear (ctx, next) {
  //   const middle = wechatMiddle(config.wechat, reply)
  //   await middle(ctx, next)
  // }
  //
  // @Post('/wechat-hear')
  // @log
  // async wxHear (ctx, next) {
  //   const middle = wechatMiddle(config.wechat, reply)
  //   await middle(ctx, next)
  // }

  @Get('/signature')
  async wxSignature (ctx, next) {
    await wechat.signature(ctx, next)
  }

  @Get('/redirect')
  async wxRedirect (ctx, next) {
    console.log('into redirect')
    await wechat.redirect(ctx, next)
  }

  @Get('/oauth')
  async wxOAuth (ctx, next) {
    await wechat.oauth(ctx, next)
  }
}
