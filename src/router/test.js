export default [
    {
        path: '/test-1',
        component: function (resolve) {
            require(['@/components/flow2/flow2.example.vue'], resolve);
        }
    },
    {
        path: '/test-2',
        component: function (resolve) {
            require(['@/components/database/database.example.vue'], resolve);
        }
    },
    
]