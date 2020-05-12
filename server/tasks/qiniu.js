const qiniu = require('qiniu')
const mongoose = require('mongoose')
const nanoid = require('nanoid')
const config = require('../../config').default

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const AllWork = mongoose.model('AllWork')

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
      client.fetch(url, bucket, key, (err, ret, info) => {
        if (err) {
          reject(err)
        }
        else {
          if (info.statusCode === 200) {
            resolve({ key })
          } else {
            reject(info)
          }
        }
      })
    })
  }

;(async () => {
  let allWork = await AllWork.find({
    $or: [
      {chapter_list: {$exists: false}},
      {chapter_list: []}
    ]
  }).exec()

  let work_item
  for (let i = 0; i < 1; i++) {
    let works = allWork[i]

    if (works && works.chapter_list && works.chapter_list.length) {
      // console.log(works.chapter_list, i);
      for (let j = 0; j < works.chapter_list.length; j++) {
        let work = works.chapter_list[j]
        // console.log('work', work, j);
        if (work && work.pic_list && work.pic_list.length) {
          // console.log(work.pic_list);
          for (let k = 0; k < work.pic_list.length; k++) {
            let wk = work.pic_list[k]
            // console.log(wk);
            if (wk && wk.img) {
              try {
                let data = await uploadToQiniu(wk.img, nanoid() + '.jpg')

                console.log(wk.img)
                if (data.key) {
                  wk.img = data.key
                }

                work.pic_list[k] = wk
              } catch (err) {
                console.log(err)
              }
            }

          }

          works.chapter_list[j] = work
        }
      }

      work_item = new AllWork(works)
      await work_item.save()
    }
  }
})()
