import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fastclick from 'fastclick'
import axios from 'axios'
import cookie from 'js-cookie'
import VConsole from 'vconsole'
import { Toast } from 'vant'
import Util from './assets/js/util'

import './assets/css/base.less'
import './assets/css/normalize.css'

Vue.use(Toast)
Vue.prototype.$axios = axios
Vue.prototype.$cookie = cookie
Vue.prototype.$store = store

fastclick.attach(document.body)

Vue.config.productionTip = false;

console.log('process', process.env)
if (Util.isDEV) {
	// new VConsole()
	// cookie.set('wx_userInfo', {user_id: 1})
}

const filterPath = [] // 过滤路由，不用微信授权
router.beforeEach((to, from, next) => {
	if (filterPath.indexOf(to.path) > -1) {
		next()
		return
	}
	next()
	// if (Util.isWX && !Util.isDEV) {
	// 	// store.registerModule('landingPage', Common.landingPage)
	// 	const info = cookie.get('wx_user_info')
	// 	if (info) {
	// 		if (to.path === '/' || to.path === '/login') next({path: `/home`, query: {...to.query}})
	// 		else next()
	// 	} else {
	// 		let visit = encodeURIComponent(to.fullPath)
	// 		if (to.path !== '/login') next({path: `/login`, query: {...to.query, visit}})
	// 		else next()
	// 	}
	// } else {
	// 	next()
	// }
})

router.afterEach((to, from) => {
	if (to.meta.title) {
		document.title = to.meta.title
	}
	if (!store.getters.url && !Util.isDEV && Util.isIOSWX) { // 记录首次进入页面的url
		store.commit('setURL', {url: `${window.location.href.split('#')[0]}`})
	}
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
