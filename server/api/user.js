import mongoose from 'mongoose'
// import moment from 'moment'

const User = mongoose.model('User')

export async function saveDBUserAsync (wxUser, from) {
  var openid = wxUser.openid

  // too slow, should move out
  // avatar = await cloudinary.uploadAvatarAsync(wxUser.headimgurl)
  var user = await User.findOne({'openid': openid}).exec()
  if (user && user.openid === openid) {
    user.role =  0,
    user.subscribe = wxUser.subscribe || 0
    user.subscribe_time = wxUser.subscribe_time || Date.now()

    if (from) {
      user.from = from
    }

    try {
      await user.update()
    } catch (e) {
      console.log(e, 'update User Error')
    }
  } else {
    user = new User({
      subscribe: wxUser.subscribe || 0,
      subscribe_time: wxUser.subscribe_time || Date.now(),
      ...wxUser
    })

    try {
      await user.save()
    } catch (e) {
      console.log(e, 'Save User Error')
    }
  }

  return {
    user: user
  }
}
