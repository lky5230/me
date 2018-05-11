import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import main from '@/main.vue'
//登录
import login from '@/views/login/login.vue'
//404
import NotFoundComponent from '@/views/NotFoundComponent.vue'
//测试路由
import test from '@/router/test.js'
/***********************************************************/

import index from '@/views/index/index.vue'

/***********************************************************/

const route_config = {
  routes: [
    {
      path: '/',
      component: main,
      meta: { requiresAuth: true },
      children: [
        // 测试
        ...test,
        { path: "", name: "index", component: index },





      
      ],
    },
    // 登录
    { path: '/login', name: 'login', component: login },
    // 404
    { path: '*', name: 'notFound', component: NotFoundComponent },

  ]
}

const router = new Router(route_config);

//路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    next()
  } else {
    next()
  }
});

export default router
