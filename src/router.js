import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      console.log(savedPosition)
      return savedPosition
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ x: 0, y: 1 });
        }, 0)
      })
      // return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: "/",
			redirect: '/home'
    },
    {
      path: "/login",
      name: "login",
      component: () => import(/* webpackChunkName: "login" */ './views/login/login'),
			meta: {keepAlive: false, title: '登录'}
    },
    {
      path: '/',
      name: 'Tabbar',
      component: () => import(/* webpackChunkName: "tabbar" */ './views/tabbar/tabbar'),
      meta: {keepAlive: true},
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import(/* webpackChunkName: "home" */ './views/tabbar/home/home'),
          meta: {keepAlive: true, title: '京多精品', key: 1}
        },
        {
          path: "/classify",
          name: "classify",
          component: () => import(/* webpackChunkName: "classify" */ './views/tabbar/classify/classify'),
          meta: {keepAlive: true, title: '分类', key: 1}
        },
        {
          path: "/me",
          name: "me",
          component: () => import(/* webpackChunkName: "me" */ './views/tabbar/me/me'),
          meta: {keepAlive: true, title: '我的', key: 1}
        }
      ]
    },
    {
      path: "/goods/search",
      name: "search",
      component: () => import(/* webpackChunkName: "search" */ './views/goods/search'),
			meta: {keepAlive: true, title: '搜索', key: 2}
    },
    {
      path: "/goods/coupon",
      name: "coupon",
      component: () => import(/* webpackChunkName: "coupon" */ './views/goods/coupon'),
			meta: {keepAlive: false, title: '优惠券', key: 2}
    },
    {
      path: "/goods/list/:path",
      name: "collect",
      component: () => import(/* webpackChunkName: "collect" */ './views/goods/collect'),
			meta: {keepAlive: false, title: '', key: 2}
    },
    {
      path: "/goods/detail/:id",
      name: "detail",
      component: () => import(/* webpackChunkName: "detail" */ './views/goods/detail'),
			meta: {keepAlive: true, title: '商品详情', key: 3}
    },
    {
      path: "/goods/tb-detail/:id",
      name: "tb-detail",
      component: () => import(/* webpackChunkName: "tb-detail" */ './views/goods/tb-detail'),
			meta: {keepAlive: true, title: '商品详情', key: 3}
    },
    {
      path: "/pdd/recommend/:path",
      name: "hot-goods",
      component: () => import(/* webpackChunkName: "hot-goods" */ './views/pdd/hot-goods'),
			meta: {keepAlive: true, title: '', key: 2}
    },
    {
      path: "/pdd/theme-goods",
      name: "theme-goods",
      component: () => import(/* webpackChunkName: "theme-goods" */ './views/pdd/theme-goods'),
			meta: {keepAlive: true, title: '主题商品', key: 2}
    }
  ]
});
