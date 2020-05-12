import topClient from '../util/topClient'
import config from '../../config'

//物料搜索
export async function getTBSearchGoods (query) {
  let result;
  let params = {
    page_no: query.page || 1,
    page_size: query.page_size || 20,
    q: query.keyword,
    sort: query.sort,
    is_tmall: query.is_tmall === 'true',
    has_coupon: query.has_coupon === 'true',
    platform: 2,
    adzone_id: config.tb.params.adzone_id
  }
  try {
    result = await topClient.execute('taobao.tbk.dg.material.optional', params);
  } catch (err) {
    throw err
  }
  return result
}


// 选品库宝贝列表
export async function getFavorites (query) {
  let result;
  let params = {
    fields: 'favorites_title,favorites_id,type'
  }
  try {
    result = await topClient.execute('taobao.tbk.uatm.favorites.get', params);
  } catch (err) {
    throw err
  }
  return result
}

// 选品库宝贝商品列表
export async function getFavoritesGoods (query) {
  let result;
  let params = {
    platform: 2,
    page_no: query.page,
    page_size: query.page_size || 20,
    favorites_id: query.favorites_id,
    adzone_id: config.tb.params.adzone_id,
    fields: 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick,shop_title,zk_final_price_wap,event_start_time,event_end_time,tk_rate,status,type'
  }
  try {
    result = await topClient.execute('taobao.tbk.uatm.favorites.item.get', params);
  } catch (err) {
    throw err
  }
  return result
}

// 物料精选商品列表
export async function getMaterialGoods (query) {
  let result;
  let params = {
    page_no: query.page,
    page_size: query.page_size || 20,
    adzone_id: config.tb.params.adzone_id
  }
  try {
    result = await topClient.execute('taobao.tbk.dg.optimus.material', params);
  } catch (err) {
    throw err
  }
  return result
}

// 关联推荐(猜你喜欢)
export async function getRecommendGoods (query) {
  let result;
  let params = {
    platform: 2,
    count: 20,
    num_iid: query.goods_id,
    fields: 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url'
  }
  try {
    result = await topClient.execute('taobao.tbk.item.recommend.get', params);
  } catch (err) {
    throw err
  }
  return result
}

// 创建淘口令
export async function createTPWD (query) {
  let result;
  let params = {
    // user_id: query.user_id,
    text: query.text,
    url: query.url,
    logo: query.logo
  }
  try {
    result = await topClient.execute('taobao.tbk.tpwd.create', params);
  } catch (err) {
    throw err
  }
  return result
}

// 淘宝客商品详情查询(简版)
export async function getGoodsInfo (query) {
  let result;
  let params = {
    num_iids: query.num_iids,
    platform: 2
  }
  try {
    result = await topClient.execute('taobao.tbk.item.info.get', params);
  } catch (err) {
    throw err
  }
  return result
}

// 淘宝客长链转短链
export async function getSpread (query) {
  let result;
  let params = {
    url: query.url
  }
  try {
    result = await topClient.execute('taobao.tbk.spread.get', params);
  } catch (err) {
    throw err
  }
  return result
}