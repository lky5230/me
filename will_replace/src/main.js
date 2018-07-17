import Vue from 'vue'
import App from './App.vue'
//router、store
import router from './router'
import store from './store'

//util
import '@/util.js'

//http
import $axios from '@/http.js'
Vue.prototype.$axios = $axios;

//mdui
import mdui from 'mdui'
import 'mdui/dist/css/mdui.min.css';
Vue.prototype.$mdui = mdui;

//elementUi
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//localforage
import localforage from 'localforage';
Vue.prototype.$localforage = localforage;

//自动注册'components'文件夹下的vue组件
import '@/register';

//css
import '@/style/reset.css';
import '@/style/globle.css';
import '@/style/font-awesome/css/font-awesome.min.css'



Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
