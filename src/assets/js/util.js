
const ua = navigator.userAgent

const isIOS = !!ua.match(/(iPhone\sOS)\s([\d_]+)/)

const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1

const isIOSWX = !!window.__wxjs_is_wkwebview

const isWX = ua.indexOf('MicroMessenger') > -1

const isQQ = ua.indexOf('QQ') > -1 && ua.indexOf('MQQBrowser') < 0

const isQQBrowser = ua.indexOf('MQQBrowser') > -1 && ua.indexOf('QQ') < 0

const isUC = ua.indexOf('UCBrowser') > -1

const isAlipay = ua.indexOf('alipay') > -1

const isBiliApp = ua.indexOf('BiliApp') > -1

const isWeiBo = ua.indexOf('Weibo') > -1 || ua.indexOf('weibo') > -1

const isBrowser = (isIOS || isAndroid) && !isWX && !isQQ && !isQQBrowser && !isUC && !isAlipay && !isBiliApp

const isDEV = process.env.NODE_ENV === 'development'

const isTest = process.env.VUE_APP_CURRENTMODE === 'test'

const isProd = process.env.VUE_APP_CURRENTMODE === 'prod'

const isProd_tg = process.env.VUE_APP_CURRENTMODE === 'prod_tg'

function toFixedTwo(x) {
  if (x == null) {
    return 0 + '.00'
  }
  let p = parseFloat(x)
  if (isNaN(p)) {
    return false
  }
  let f = Math.round(x * 100) / 100
  let s = f.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

function objKeySort(obj) { // 排序字母 小->大
  let newkey = Object.keys(obj).sort()
  // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let newObj = {}
  for (let i = 0; i < newkey.length; i++) {
    newObj[newkey[i]] = obj[newkey[i]] // 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj
}

function getBase64 (url) {
  // 通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
  let Img = new Image()
  let dataURL = ''
  Img.setAttribute('crossOrigin', 'Anonymous') // Img.crossOrigin = 'anonymous'
  Img.src = url
  return new Promise((resolve, reject) => {
    Img.onload = () => { // 要先确保图片完整获取到，这是个异步事件
      let canvas = document.createElement('canvas') // 创建canvas元素
      let width = Img.width // 确保canvas的尺寸和图片一样
      let height = Img.height
      // 按比例压缩*倍
      // let rate = (width < height ? width / height : height / width) / 0.8
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(Img, 0, 0, width, height) // 将图片绘制到canvas中
      dataURL = canvas.toDataURL('image/jpeg') // 转换图片为dataURL
      return resolve(dataURL)
    }
    Img.onerror = () => {
      return reject(dataURL)
    }
  })
}

// 获取滚动条当前的位置
function getScrollTop() {
  let scrollTop = 0
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop
  } else if (window.pageYOffset) {
    scrollTop = window.pageYOffset
  } else if (document.body) {
    scrollTop = document.body.scrollTop
  }
  return scrollTop
}

// 获取当前可视范围的高度
function getClientHeight() {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
  } else {
    clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
  }
  return clientHeight
}

// 获取文档完整的高度
function getScrollHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
}

function add(a, b) {
  let c, d, e, f
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  f = (mul(a, e) + mul(b, e)) / e
  return f
}

function sub(a, b) {
  let c, d, e, f
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
   e = Math.pow(10, Math.max(c, d))
   f = (mul(a, e) - mul(b, e)) / e
  return f
}

function mul(a, b) {
  let c = 0
  let d = a.toString()
  let e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {}
  try {
    c += e.split('.')[1].length
  } catch (f) {}
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}

function div(a, b) {
  let c, d, g
  let e = 0
  let f = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) {}
  try {
    f = b.toString().split('.')[1].length
  } catch (g) {}
  c = Number(a.toString().replace('.', ''))
  d = Number(b.toString().replace('.', ''))
  g = mul(c / d, Math.pow(10, f - e))
  return g
}

function convertUnits(str) {
  let decodeStr = decodeURIComponent(str)
  let digit = decodeStr.split('人')[0] | 0
  if (typeof digit !== 'number' || !digit) return decodeStr + '人付款'
  if (digit < 10000) return digit + '人付款'
  return (digit / 10000).toFixed(2) + '万人付款'
}

function scrollTopTo(top, callback) {
  var scrollTop = document.scrollingElement.scrollTop;
  var rate = 2;

  var funTop = function () {
    scrollTop = scrollTop + (top - scrollTop) / rate;

    // 临界判断，终止动画
    if (Math.abs(scrollTop - top) <= 1) {
      document.scrollingElement.scrollTop = top;
      callback && callback();
      return;
    }
    document.scrollingElement.scrollTop = scrollTop;
    // 动画gogogo!
    requestAnimationFrame(funTop);
  };
  funTop();
};

export default {
  isIOS,
  isAndroid,
  isWX,
  isIOSWX,
  isBiliApp,
  isWeiBo,
  isBrowser,
  isDEV,
  isTest,
  isProd,
  isProd_tg,
  toFixedTwo,
  objKeySort,
  getBase64,
  getScrollTop,
  getClientHeight,
  getScrollHeight,
  convertUnits,
  scrollTopTo
}