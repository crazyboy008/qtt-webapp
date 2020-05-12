import {
  Controller,
  Get,
  Post,
  Required,
} from '../decorator/router'
import { getAllUser, getSetUser } from '../service/user'

@Controller('/user')
export default class MovieRouter {
  @Get('/info')
  @Required({
    body: ['id']
  })
  async getUserInfo (ctx, next) {
    const id = ctx.query.id
    const data = await getAllUser(id)

    ctx.body = {
      status: 'success',
      msg: '',
      result: {data}
    }
  }
  @Post('/setIsUnlock')
  @Required({
    body: ['id']
  })
  async getSetIsUnlock (ctx, next) {
    const id = ctx.request.body.id
    const userInfo = await getSetUser(id)

    ctx.body = {
      status: 'success',
      msg: '',
      result: userInfo
    }
  }

}