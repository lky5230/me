import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //当前页信息
    cureentPage: {},
    //目录信息（层次+扁平化）
    deepMenu: [],
    expandMenu: [],
    timestamp: 0,
  },
  mutations: {
    //切换-当前页信息
    changeCurrentPage(state, payload){
      state.cureentPage = payload;
    },
    //获取目录信息
    getMenu(state, payload){
      state.deepMenu = payload.deepMenu;
      state.expandMenu = payload.expandMenu;
    },
    //生成新的时间戳
    createTimestamp(state, payload){
      state.timestamp = Date.now();
    },

  },
  actions: {
    // 页面跳转
    goPage({state, commit, dispatch}, payload){
      console.log(payload)
      let url = payload.url;
      router.push(url);
    }
  }
})
