import { join } from 'path'
import mongoose from 'mongoose'
import glob from 'glob'
import R from 'ramda'
import config from '../../config/index'

mongoose.Promise = global.Promise

const TASKS = [
  // 'free-list',
  // 'category-list',
  // 'chapter-list',
  // 'pic-list',
  // 'qiniu'
]

glob.sync(join(__dirname, '../database/schema', '**/*.js')).forEach(require)
if (TASKS.length) {
  R.map(
    R.compose(
      require,
      name => join(__dirname, `../tasks/${name}`)
    )
  )(TASKS)
}

export const database = app => {
  const { db } = config

  if (process.env.NODE_ENV || 'development') {
    mongoose.set('debug', true)
  }

  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB -> ', db)
  })
}
