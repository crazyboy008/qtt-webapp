import mongoose from 'mongoose'

const User = mongoose.model('User')

export const getAllUser = async (id) => {
  let query = {}

  if (id) {
    query.id = {$in: [id]}
  }
  const data = await User.findOne(query)
  return data
}

export const getSetUser = async (id) => {
  const OldData = await getAllUser(id)
  // console.log(OldData);
  OldData.is_unlock = !!parseInt(OldData.is_unlock) ? '0' : '1'
  const newData = await OldData.save()
  return newData
}