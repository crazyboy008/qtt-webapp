import {
  Controller,
  Get,
  Required,
} from '../decorator/router'
import { getAllBanner, getAllCategory, getWorkDetail } from '../service/home'

@Controller('/home')
export default class MovieRouter {
  @Get('/banner')
  async getBannerList (ctx, next) {
    const type = ctx.query.work_type
    const data = await getAllBanner(type)

    ctx.body = {
      status: 'success',
      msg: '',
      result: data
    }
  }

  @Get('/category')
  async getCategoryList (ctx, next) {
    const type = ctx.query.work_type
    const data = await getAllCategory(type)

    ctx.body = {
      status: 'success',
      msg: '',
      result: data
    }
  }
  
  @Get('/detail')
  async getDetail (ctx, next) {
    const id = ctx.query.work_id
    const data = await getWorkDetail(id)

    ctx.body = {
      status: 'success',
      msg: '',
      result: data
    }
  }
}