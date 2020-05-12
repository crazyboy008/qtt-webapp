import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    url: null,
    tbGoodsDetail: null
  },
  getters: {
    url (state) {
      return state.url
    },
    tbGoodsDetail (state) {
      return state.tbGoodsDetail
    }
  },
  mutations: {
    setURL (state, payload) {
      state.url = payload.url
    },
    setTBGoodsDetail (state, payload) {
      state.tbGoodsDetail = payload
    }
  },
  actions: {}
});
