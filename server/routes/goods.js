
import {
  Controller,
  Get,
  Required,
} from '../decorator/router'
import {
  getBanner,
  getHotGoods,
  getCategoryOneLevel,
  getCategoryGoodsList,
  getGoodsDetail,
  getGoodsSearch,
  getHotSearch,
  getRelativeWord,
  getPDDHotGoods,
  getPDDThemeGoods,
  urlGenerate
} from '../api/goods'
import Util from '../util'

function each(data) {
  let list = []
  data.forEach(item => {
    list.push({
      header_imgs: item.goods_gallery_urls,
      title: item.goods_name, // 标题
      img: item.goods_image_url, // 图片
      goods_desc: item.goods_desc,
      buy_num: item.sales_tip, // 多少人购买
      is_tmall: 3, // 1:天猫,2:淘宝, 3：拼多多
      has_coupon: item.has_coupon, // 是否有优惠券
      price: (item.min_group_price - item.coupon_discount) / 100, // 价格
      original_price: item.min_group_price / 100, // 原价
      source_id: item.goods_id,
      coupon: {
        coupon_price: item.coupon_discount /100,
        coupon_start_date: Util.formatTime(item.coupon_start_time),
        coupon_end_date: Util.formatTime(item.coupon_end_time)
      },
      shop: {
        shop_type: 'pdd',
        shop_title: item.mall_name,
        shop_logo: item.mall_logo,
        item_score: item.desc_txt,
        delivery_score: item.serv_txt,
        service_score: item.lgst_txt
      }
    })
  })
  return list
}

@Controller('/goods')
export default class GoodsRouter {

  @Get('/banner')
  async _getBannerData (ctx, next) {
    try {
      const {theme_list_get_response} = await getBanner(ctx.query)
      let data = theme_list_get_response.theme_list
      ctx.body = {
        status: 'success',
        msg: '',
        result: data
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/hot')
  async _getHotGoods (ctx, next) {
    try {
      const {top_goods_list_get_response, error_response} = await getHotGoods(ctx.query)
      const {list, total} = top_goods_list_get_response
      if (!error_response) {
        let limit = ctx.query.limit | 0
        let all_page = (total/limit).toFixed(0) | 0
        if(total%limit > 0) {
          all_page += 1
        }
        let data = each(list)
        ctx.body = {
          status: 'success',
          msg: '',
          result: {data, all_page, total}
        }
      } else {
        ctx.body = {
          status: 'error',
          errMsg: error_response
        }
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/category/list')
  async _getCategoryData (ctx, next) {
    try {
      let result  = await getCategoryOneLevel(ctx.query)
      let {goods_opt_get_response, error_response} = result
      let data = [], i
      let list = goods_opt_get_response.goods_opt_list
      for (i = 0; i < list.length; ++i) {
        if (list[i].opt_name === '海淘' || list[i].opt_name === '充值') continue
        data.push({
          name: list[i].opt_name,
          id: list[i].opt_id,
          ...list[i]
        })
      }
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/category/goods')
  async _getCategoryGoodsData (ctx, next) {
    try {
      const {goods_search_response, error_response} = await getCategoryGoodsList(ctx.query)
      const {goods_list, total_count} = goods_search_response
      if (!error_response) {
        let limit = ctx.query.page_size | 0
        let all_page = (total_count/limit).toFixed(0) | 0
        if(total_count%limit > 0) {
          all_page += 1
        }
        let data = each(goods_list)
        ctx.body = {
          status: 'success',
          msg: '',
          result: {data, all_page, total: total_count}
        }
      } else {
        ctx.body = {
          status: 'error',
          errMsg: error_response
        }
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/detail')
  async _getGoodsDetailData (ctx, next) {
    try {
      const {goods_detail_response, error_response} = await getGoodsDetail(ctx.query)
      let data = each(goods_detail_response.goods_details)
      ctx.body = {
        status: 'success',
        msg: '',
        result: data[0]
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/search-goods')
  async _getSearchGoodsData (ctx, next) {
    try {
      const {goods_search_response, error_response} = await getGoodsSearch(ctx.query)
      const {goods_list, total_count} = goods_search_response
      let limit = ctx.query.page_size | 0
      let all_page = (total_count/limit).toFixed(0) | 0
      if(total_count%limit > 0) {
        all_page += 1
      }
      let data = each(goods_list)
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data, all_page, total: total_count}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/pdd-hot-goods')
  async _getPDDhotGoodsData (ctx, next) {
    try {
      const {goods_basic_detail_response, error_response} = await getPDDHotGoods(ctx.query)
      const {list, total} = goods_basic_detail_response
      let limit = ctx.query.limit | 0
      let all_page = (total/limit).toFixed(0) | 0
      if(total%limit > 0) {
        all_page += 1
      }
      let data = each(list)
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data, all_page, total}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/pdd-theme-goods')
  async _getPDDThemeGoods (ctx, next) {
    try {
      const {theme_list_get_response, error_response} = await getPDDThemeGoods(ctx.query)
      const {goods_list, total} = theme_list_get_response
      let limit = ctx.query.limit | 0
      let offset = ctx.query.offset | 0
      let all_page = (total/limit).toFixed(0) | 0
      if(total%limit > 0) {
        all_page += 1
      }
      let data = each(goods_list).splice(offset - 20, offset)
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data, all_page, total}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/pdd-url-generate')
  async _urlGenerate (ctx, next) {
    try {
      const {goods_promotion_url_generate_response, error_response} = await urlGenerate(ctx.query)
      let data = goods_promotion_url_generate_response.goods_promotion_url_list[0]
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/search-hot')
  async _getSearchHotData (ctx, next) {
    try {
      const {result} = await getHotSearch(ctx.query)
      ctx.body = {
        status: 'success',
        msg: '',
        result
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/relative-word')
  async _getRelativeWordData (ctx, next) {
    try {
      const {result} = await getRelativeWord(ctx.query)
      ctx.body = {
        status: 'success',
        msg: '',
        result
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

}
