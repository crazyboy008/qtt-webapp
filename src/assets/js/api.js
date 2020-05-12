import Http from './http'

// 全部商品
export function getBannerData(params) {
  return Http.get('/goods/banner', params)
}

// 全部商品
export function getGoodsList(params) {
  return Http.get('/goods/hot', params)
}

// 分类列表
export function getClassifyData(params) {
  return Http.get('/goods/category/list', params)
}

// 分类商品列表
export function getClassifyGoodsList(params) {
  return Http.get('/goods/category/goods', params)
}

// 商品详情
export function getGoodsDetail(params) {
  return Http.get('/goods/detail', params)
}

// 商品搜索
export function getGoodsSearch(params) {
  return Http.get('/goods/search-goods', params)
}

// 商品搜索
export function getPDDHotGoods(params) {
  return Http.get('/goods/pdd-hot-goods', params)
}

// 商品搜索
export function getPDDThemeGoods(params) {
  return Http.get('/goods/pdd-theme-goods', params)
}

// 生成pdd推广链接
export function urlGenerate(params) {
  return Http.get('/goods/pdd-url-generate', params)
}

// 获取热门搜索关键词
export function getHotSearch(params) {
  return Http.get('/goods/search-hot', params)
}

// 获取搜索联想词
export function getRelativeWord(params) {
  return Http.get('/goods/relative-word', params)
}

// 获取用户信息
export function getUserInfo(params) {
  return Http.get('/user/info', params)
}

// 获取淘宝选品库id
export function getFavorites(params) {
  return Http.get('/tb-goods/favorites', params)
}

// 获取淘宝选品库商品列表
export function getFavoritesGoods(params) {
  return Http.get('/tb-goods/favorites-goods', params)
}

// 获取淘宝搜索商品列表
export function getTbGoodsSearch(params) {
  return Http.get('/tb-goods/search', params)
}

// 获取淘宝商品详情
export function getTbGoodsDetail(params) {
  return Http.get('/tb-goods/goods-info', params)
}

// 创建淘口令
export function createTPWD(params) {
  return Http.get('/tb-goods/create-tpwd', params)
}
