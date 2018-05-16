export default [
    {
        path: '/flow',
        component: function (resolve) {
            require(['@/components/flow2/flow2.example.vue'], resolve);
        }
    },
    {
        path: '/database',
        component: function (resolve) {
            require(['@/components/database/database.example.vue'], resolve);
        }
    },
    
]