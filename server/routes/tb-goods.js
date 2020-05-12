
import {
  Controller,
  Get,
  Required,
} from '../decorator/router'
import {
  getTBSearchGoods,
  getFavorites,
  getFavoritesGoods,
  getMaterialGoods,
  getRecommendGoods,
  createTPWD,
  getGoodsInfo
} from '../api/tb-goods'
import Util from '../util'

function each(data, query) {
  let list = []
  data.forEach(item => {
    list.push({
      goods_url: item.item_url,
      title: item.title, // 标题
      img: item.pict_url, // 图片
      goods_desc: item.goods_desc,
      buy_num: item.volume, // 多少人购买
      header_imgs: item.small_images ? item.small_images.string : [],
      is_tmall: query && query.is_tmall === 'true' ? 1 : 2, // 1:天猫,2:淘宝, 3：拼多多
      has_coupon: item.has_coupon, // 是否有优惠券
      price: item.zk_final_price, // 价格
      original_price: item.reserve_price, // 原价
      source_id: item.item_id || item.num_iid,
      free_shipment: item.free_shipment, // 是否包邮
      coupon_url: item.coupon_share_url || item.coupon_click_url, //链接-宝贝+券二合一页面链接
      url: item.url || item.click_url, //链接-宝贝推广链接,
      short_title: item.short_title, // 商品短标题
      is_prepay: item.is_prepay, // 是否加入消费者保障
      provcity: item.provcity, // 宝贝所在地
      real_post_fee: item.real_post_fee, // 商品邮费
      item_description: item.item_description, // 宝贝描述(推荐理由)
      coupon: {
        coupon_info: item.coupon_info,
        coupon_id: item.coupon_id,
        coupon_price: Util.sub(item.reserve_price, item.zk_final_price),
        coupon_amount: item.coupon_amount,
        coupon_start_date: item.coupon_start_time,
        coupon_end_date: item.coupon_end_time,
        coupon_total_count: item.coupon_total_count, // 优惠券总量
        coupon_remain_count: item.coupon_remain_count // 优惠券剩余量
      },
      shop: {
        shop_title: item.nick,
        shop_logo: item.mall_logo,
        seller_id: item.seller_id,
        item_score: item.h_good_rate,
        delivery_score: item.i_rfd_rate,
        service_score: item.h_pay_rate30
      },
      presale: {
        presale_deposit: item.presale_deposit, // 预售商品-定金（元）
        presale_discount_fee_text: item.presale_discount_fee_text, //预售商品-商品优惠信息
        presale_tail_end_time: item.presale_tail_end_time, // 预售商品-付定金结束时间（毫秒）
        presale_tail_start_time: item.presale_tail_start_time, // 预售商品-付定金开始时间（毫秒）
        presale_end_time: item.presale_end_time, // 预售商品-付定金结束时间（毫秒）
        presale_start_time: item.presale_start_time // 预售商品-付定金开始时间（毫秒）
      },
      ju_play_end_time: item.ju_play_end_time, // 聚划算满减 -结束时间（毫秒）
      ju_play_start_time: item.ju_play_start_time, // 聚划算满减 -开始时间（毫秒）
      tmall_play_activity_end_time: item.tmall_play_activity_end_time, // 天猫限时抢可售 -结束时间（毫秒）
      tmall_play_activity_start_time: item.tmall_play_activity_start_time, // 天猫限时抢可售 -开始时间（毫秒）
    })
  })
  return list
}

@Controller('/tb-goods')
export default class TBGoodsRouter {
  @Get('/search')
  @Required({
    query: ['keyword']
  })
  async _getSearchGoods(ctx, next) {
    try {
      const {result_list, total_results} = await getTBSearchGoods(ctx.query)
      let limit = (ctx.query.page_size | 0) || 20
      let all_page = (total_results/limit).toFixed(0) | 0
      if(total_results%limit > 0) {
        all_page += 1
      }
      let data = each(result_list.map_data, ctx.query)
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data, all_page, total: total_results}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/favorites')
  async _getFavorites(ctx, next) {
    try {
      const {results, total_results} = await getFavorites(ctx.query)
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data: results.tbk_favorites}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/favorites-goods')
  async _getFavoritesGoods(ctx, next) {
    try {
      const {results, total_results} = await getFavoritesGoods(ctx.query)
      let limit = (ctx.query.page_size | 0) || 20
      let all_page = (total_results/limit).toFixed(0) | 0
      if(total_results%limit > 0) {
        all_page += 1
      }
      let data = each(results.uatm_tbk_item)
      ctx.body = {
        status: 'success',
        msg: '',
        result: {data, all_page, total: total_results}
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/material-goods')
  async _getMaterialGoods(ctx, next) {
    try {
      const results = await getMaterialGoods(ctx.query)
      console.log(results)
      // let limit = (ctx.query.page_size | 0) || 20
      // let all_page = (total_results/limit).toFixed(0) | 0
      // if(total_results%limit > 0) {
      //   all_page += 1
      // }
      // let data = each(results.uatm_tbk_item)
      ctx.body = {
        status: 'success',
        msg: '',
        result: results
      }
    } catch (err) {
      console.log('err', err);
      ctx.body = ({
        status: 'error',
        errMsg: err
      })
    }
  }

  @Get('/recommend-goods')
  async _getRecommendGoods(ctx, next) {
    try {
      const result = await getRecommendGoods(ctx.query)
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

  @Get('/create-tpwd')
  async _createTPWD(ctx, next) {
    try {
      const {data} = await createTPWD(ctx.query)
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

  @Get('/goods-info')
  async _getGoodsInfo(ctx, next) {
    try {
      const {results} = await getGoodsInfo(ctx.query)
      let data = each(results.n_tbk_item)
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

}