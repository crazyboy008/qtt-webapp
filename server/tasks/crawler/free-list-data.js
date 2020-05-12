const puppeteer = require('puppeteer')

let result = [], browser
let url = (num = 1) => {
return `https://ac.qq.com/Comic/all/search/hot/vip/1/page/${num}`
}

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

const getData = async (i) => {
  let page = await browser.newPage()
  await page.goto(url(i), {
    waitUntil: 'networkidle2'
  })
  await sleep(2000)

  let data = await page.evaluate(() => {
    var $ = window.$
    var items = $('.ret-search-item')
    var arr = []

    if (items.length >= 1) {
      items.each((index, item) => {
        console.log(item);
        let classify = []
        let it = $(item)
        let works = $(it.find('.ret-works-title a'))
        let tags = $(it.find('.ret-works-tags'))
        let work_id = works.attr('href').split('id/')[1].split('/')[0]
        let title = works.attr('title').replace(/\n/g, '').replace(/\r/g, '').replace(/\//g, '').trim()
        let img = it.find('.lazy').attr('data-original')
        let pen_name = it.find('.ret-works-author').attr('title')
        let brief = it.find('.ret-works-decs').text()
        let read = tags.find('em').text()
        $(tags).find('a').each((i, v) => {
          classify.push(v.innerHTML)
        })

        arr.push({
          work_id,
          title,
          img,
          pen_name,
          classify,
          read,
          brief,
          work_type: '2'
        })
      })
    }

    return arr
  })

  page.close()
  return data;
}

const list = async () => {
  for (let i = 3; i < 4; i++) {
    await getData(i).then(res => {
      result.push(...res)
    })
  }
  console.log('data succeed');
  browser.close()
  process.send({result})
  process.exit(0)
}

;(async () => {
  console.log('Start visit the target page')

  browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  list()
})()

