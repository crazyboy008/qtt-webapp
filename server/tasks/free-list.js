const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')

const AllWork = mongoose.model('AllWork')

;(async () => {
  const script = resolve(__dirname, './crawler/free-list-data')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = true
    code === 0 ? null : new Error('exit code ' + code)

  })

  child.on('message', data => {
    let result = data.result
      result.forEach(async (item) => {
        let work = await AllWork.findOne({
          work_id: item.work_id
        }).exec()

        if (!work) {
          work = new AllWork(item)
          await work.save()
        }
      })
  })
})()