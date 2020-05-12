const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const AllWork = mongoose.model('AllWork')

let browser
let url = (id) => {
  return `https://m.ac.qq.com/comic/chapterList/id/${id}`
}

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const getData = async (id) => {
  let page = await browser.newPage()
  await page.goto(url(id), {
    waitUntil: 'networkidle2'
  })

  // await sleep(2000)

  let data = await page.evaluate(() => {
    var $ = window.$
    var items = $('.reverse .chapter-item')
    var arr = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let link = $($(item).find('.chapter-link'))
        let chapter_id = link.attr('data-cid').trim()
        let name = link.attr('data-seq').trim()
        arr.unshift({
          chapter_id,
          name
        })
      })
    }

    return arr
  })

  page.close()
  return data;
}

const list = async () => {
  let allWork = await AllWork.find().exec()
  allWork.forEach(async item => {

    await getData(item.work_id).then(res => {
      if (!item.chapter_list) {
        item.chapter_list = res
      } else if (!item.chapter_list.length) {
        item.chapter_list = res
      }
    })

    await item.save()
  })
  // browser.close()
    // process.send('succeed')
    // process.exit(0)
  }

;(async () => {
  console.log('Start visit the target page')

  browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  list()
})()