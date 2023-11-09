// 引入组件
import CartIndex from '@/components/cart/index.vue'
import CartConfirm from '@/components/cart/confirm.vue'

//子路由列表
const children = [ //子路由
    {
        name: 'CartIndex',
        path: 'index',
        component: CartIndex,
        meta: { auth: true },
    },
    {
        name: 'CartConfirm',
        path: 'confirm',
        component: CartConfirm,
        meta: { auth: true },
    },
]

//1级路由的组件
const layout = {
    template: `<router-view></router-view>`
}

// 组装一个客户的路由
export default {
    name: 'cart',
    path: '/cart', //1级路由
    component: layout, //组件
    children: children
}