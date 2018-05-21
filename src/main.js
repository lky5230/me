import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//jquery
import $ from 'jquery'

//滚动条
import '@/util/scrollbar.js'
import '@/util/perfect-scrollbar.css'

//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

//表格组件
import database from '@/components/database/database3'
Vue.component('database', database)

//css
import '@/style/reset.css'
import '@/style/font-awesome/css/font-awesome.min.css'
import '@/style/globle.css'

//http拦截
import '@/api/interceptor.js'

//util
import '@/util/util.js'

//移动端、PC端
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  store.commit('setBrowerType', 'phone');
} else {
  store.commit('setBrowerType', 'pc');
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
