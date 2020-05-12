const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const AllWork = mongoose.model('AllWork')

let browser
let url = (work_id, chapter_id) => {
  return `https://m.ac.qq.com/chapter/index/id/${work_id}/cid/${chapter_id}`
}

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const getData = async (work_id, chapter_id) => {
  let page
  try{
    page = await browser.newPage()
  } catch (err) {
    console.log('newPage error', err);
  }
  await page.goto(url(work_id, chapter_id), {
    waitUntil: 'networkidle2'
  }).catch(err => {
    console.log('page goto error', err);
  })

  await sleep(2000)

  try {
    let data = await page.evaluate(() => {
      var $ = window.$
      var items = $('.comic-pic-item')
      var arr = []

      if (items && items.length) {
        items.each((index, item) => {
          let img = $(item).find('.comic-pic').attr('data-src').trim()
          arr.push({
            img
          })
        })
      }

      return arr
    })

    page.close()
    return data;
  } catch (err) {
    console.log('page error', err);
  }
}

const list = async () => {
    let works = await AllWork.find().exec()

    for (let i = 0; i < 1; ++i) {

      let work_item = await AllWork.findOne({work_id: works[i].work_id}).exec()
      let chapter_list = work_item.chapter_list
      if (chapter_list && chapter_list.length) {
        for(let j = 0; j < chapter_list.length; ++j) {

          if (!chapter_list[j].pic_list || !chapter_list[j].pic_list.length) {
            const res = await getData(works[i].work_id, chapter_list[j].chapter_id)
            if (res && res.length) {
              work_item.chapter_list[j].pic_list = res
            }
          }

        }

        let work = new AllWork(work_item)
        await work.save()
      }
    }

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