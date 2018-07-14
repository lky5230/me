import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      component: r => require.ensure([], () => r(require('@/views/home.vue')), 'home'),

      children: [
        {
          path: '',
          name: 'index',
          component: r => require.ensure([], () => r(require('@/views/index/index.vue')), 'index')
        },{
          path: 'test',
          name: 'test',
          component: r => require.ensure([], () => r(require('@/views/test/test.vue')), 'test')
        },
      ]

    },
    // 登录
    { 
      path: '/login', 
      name: 'login', 
      component: r => require.ensure([], () => r(require('@/views/login.vue')), 'login')
    },
    // 404
    { 
      path: '*', 
      name: 'notFound',  
      component: r => require.ensure([], () => r(require('@/views/404.vue')), 'notFound')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
});

export default router;