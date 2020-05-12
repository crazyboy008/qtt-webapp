import request from 'request-promise'
import Util from '../util/sign'
import config from '../../config'

const base = 'http://api.jpjie.com'

// 获取banner图片
export async function getBanner (params = {}) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.theme.list.get'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取热销商品
export async function getHotGoods (params = {}) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.top.goods.list.query'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取商品分类
export async function getCategoryOneLevel (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.goods.opt.get'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取分类商品列表
export async function getCategoryGoodsList (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.goods.search'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取商品详情
export async function getGoodsDetail (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.goods.detail'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取搜索商品
export async function getGoodsSearch (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.goods.search'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取PDD9.9，热销，优惠商品
export async function getPDDHotGoods (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.goods.recommend.get'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取pdd主题商品
export async function getPDDThemeGoods (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.theme.goods.search'}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 生成pdd推广链接
export async function urlGenerate (params) {
  let allParmas = {...params, ...config.pdd.commonParams, type: 'pdd.ddk.goods.promotion.url.generate', p_id: config.pdd.p_id}
  let options = {
    url: config.pdd.host,
    json: true,
    qs: {...allParmas, sign: Util.PDDSign(allParmas)}
  }
  const response = await request(options)
  return response
}

// 获取热门搜索关键词
export async function getHotSearch (params) {
  let options = {
    url: base + '/search/getKeyWords',
    json: true,
    qs: params
  }
  const response = await request(options)
  return response
}

// 获取搜索联想词
export async function getRelativeWord (params) {
  let options = {
    url: base + '/search/sug',
    json: true,
    qs: params
  }
  const response = await request(options)
  return response
}