const directive = {
  drag: {
    bind: function (el, binding) {
      let event, intervalX, intervalY
      event = el
      event.addEventListener('touchstart', function (e) {
        let touch = e.touches ? e.touches[0] : e
        let { clientX, clientY } = touch
        intervalX = clientX - event.offsetLeft  // 手指按下x坐标 - 拖拽按钮x坐标  得到手指按下 距离 拖拽按钮 的间距
        intervalY = clientY - event.offsetTop
        e.preventDefault()
      })
      event.addEventListener('touchmove', function (e) {
        let touch = e.touches ? e.touches[0] : e
        let { clientX, clientY } = touch
        /* 鼠标坐标 - 鼠标与拖拽按钮的 间距坐标  得到 拖拽按钮的 左上角 x轴y轴坐标 */
        let moveX = clientX - intervalX
        let moveY = clientY - intervalY
        let clientWidth = window.innerWidth  || document.documentElement.clientWidth || document.body.clientWidth
        let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        if (moveX > clientWidth - event.clientWidth) moveX = clientWidth - event.clientWidth
        else if (moveX < 0) moveX = 0
        if (moveY > clientHeight - event.clientHeight) moveY = clientHeight - event.clientHeight
        else if (moveY < 0) moveY = 0
        event.style.left = moveX + 'px'
        event.style.top = moveY + 'px'
        binding.value({x: touch.pageX, y: touch.pageY})
        e.preventDefault()
        e.stopPropagation()
      })
      event.addEventListener('touchend', function (e) {
        event.removeEventListener('touchstart', this)
        event.removeEventListener('touchmove', this)
        e.preventDefault()
      })
    },
    unbind: function (event) {
      event.removeEventListener('touchend', this)
    }
  }
}

const landingPage = {
  state: {
    url: null
  },
  getters: {
    url (state) {
      return state.url
    }
  },
  mutations: {
    setURL (state, payload) {
      state.url = payload.url
    }
  }
}

const config = {
  appid: 'wxd04bc65da2a31cbe'
}

export default { landingPage, config }
