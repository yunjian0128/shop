// 引入组件
import OrderIndex from '@/components/order/index.vue'

//子路由列表
const children = [ //子路由
    {
        name: 'OrderIndex',
        path: 'index',
        component: OrderIndex,
        meta:{auth: true},
    },
]

//1级路由的组件
const layout = {
    template: `<router-view></router-view>`
}

// 组装一个客户的路由
export default {
    name: 'order',
    path: '/order', //1级路由
    component: layout, //组件
    children: children
}