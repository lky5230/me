import Vue from 'vue'
import Vuex from 'vuex'
import localforage from 'localforage'

Vue.use(Vuex)

const store = new Vuex.Store({
  
  state: {
    //应用本地存储的唯一标记
    appid: 'app-me-2018-08-08',
    //移动端(phone)、电脑端(pc)
    browerType: 'pc',
    //原始菜单
    menu: [],
    //搜索历史记录
    historySearch: [],
    //历史记录条数
    historySearchLimit: 6,
    /* 
    * 侧边栏类型('left', 'hover')
    */
    sidebarType: 'left',
    //'left'类型侧边栏（只和'left'类型侧边栏搭配）-是否展开
    isExpand: false,
    
  },

  getters: {
    //扁平化（添加_fullPathName）的一体化菜单
    fullMenu(state){
      let data = Vue.prototype.utils.cleanData(state.menu);
      let arr = [], temp = [], endIndex = 0;
      cleanTree(data, 0);
      return arr;
      function cleanTree(data, level){
        for(let i=0; i<data.length; i++){
          temp[level] = data[i].name;
          endIndex = level;
          if(data[i]._child.length != 0){
            cleanTree(data[i]._child, level + 1);
          }else{
            arr.push({ ...data[i], _fullPathName: temp.slice(0, +endIndex + 1).join('#_#') });
          }
        }
      };
    },
    
  },

  mutations: {
    //设置手机端还是电脑端
    setBrowerType(state, payload){
      state.browerType = payload;
    },
    
    //获取原始菜单
    getMenu(state, payload){
      state.menu = payload;
    },

    //设置历史记录
    setHistory(state, payload){
      state.historySearch = payload;
    },

    //left类型侧边栏-是否展开
    setExpand(state, payload){
      if(payload != undefined){
        store.state.isExpand = payload;
      }else{
        store.state.isExpand = !store.state.isExpand;
      }
      
    },
    
    
  },

  actions: {
    //获取历史记录
    async getSearchHistory({state, commit}){
      let value = await localforage.getItem(state.appid+'historySearch');
      if(value){
        commit('setHistory', value.slice(0, state.historySearchLimit));
      }else{
        commit('setHistory', []);
      }
    },

    //保存历史记录
    async saveSearchHistory({state, commit}, data){
      let vm = this;
      let value = await localforage.getItem(state.appid+'historySearch')
      if(!value){
        localforage.setItem(state.appid+'historySearch', []).then(value2 => {
          saveFn(data, value2)
        })
      }else{
        saveFn(data, value)
      }
      //保存到本地历史记录
      function saveFn(data, oldHistory){
        for(let i=0; i<oldHistory.length; i++){
          if(oldHistory[i].id == data.id){
            //已存在该记录，就需要放到首位来
            oldHistory.splice(i, 1);
            break ;
          }
        };
        oldHistory.unshift(data);
        localforage.setItem(state.appid+'historySearch', oldHistory).then(res => {
          commit('setHistory', res.slice(0, state.historySearchLimit));
        });
      };
    },

    /*
    * 菜单项-点击
    */
    menuClick({state, commit}, menu){
      console.log(menu)
    },

  },

  
  modules: {

  },

});

export default store
