

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime (time, symbol, minutes) {
  if (typeof time === 'undefined') return ''
  let date = new Date(time * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join(symbol || '/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  if (minutes) return `${t1} ${t2}`
  else return t1
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

export default {
  formatTime,
  add,
  sub
}