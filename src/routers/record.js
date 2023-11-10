// 引入组件
import RecordIndex from '@/components/record/index.vue'

//子路由列表
const children = [ //子路由
    {
        name: 'RecordIndex',
        path: 'index',
        component: RecordIndex,
        meta: { auth: true },
    },
]

//1级路由的组件
const layout = {
    template: `<router-view></router-view>`
}

// 组装一个客户的路由
export default {
    name: 'record',
    path: '/record', //1级路由
    component: layout, //组件
    children: children
}