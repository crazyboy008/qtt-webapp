import mongoose from 'mongoose'

const Banner = mongoose.model('Banner')

export const getAllBanner = async (type) => {
  let query = {}

  if (type) {
    query.work_type = {$in: [type]}
  }

  const data = await Banner.find(query)
  return data
}