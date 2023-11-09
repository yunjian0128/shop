// 引入组件
import AddressIndex from '@/components/address/index.vue'
import AddressAdd from '@/components/address/add.vue'
import AddressEdit from '@/components/address/edit.vue'

// 子路由列表
const children = [ //子路由
    {
        name: 'AddressIndex',
        path: 'index',
        component: AddressIndex,
        meta: { auth: true },
    },
    {
        name: 'AddressAdd',
        path: 'add',
        component: AddressAdd,
        meta: { auth: true },
    },
    {
        name: 'AddressEdit',
        path: 'edit',
        component: AddressEdit,
        meta: { auth: true },
    },
]

// 1级路由的组件
const layout = {
    template: `<router-view></router-view>`
}

// 组装一个客户的路由
export default {
    name: 'address',
    path: '/address', // 1级路由
    component: layout, // 组件
    children: children
}