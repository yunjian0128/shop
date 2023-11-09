// 引入组件
import register from '@/components/business/register.vue'
import login from '@/components/business/login.vue'
import BusinessIndex from '@/components/business/index.vue'
import BusinessProfile from '@/components/business/profile.vue'
import BusinessEmail from '@/components/business/email.vue'

//子路由列表
const children = [ //子路由
    {
        // /business/register
        name: 'register',
        path: 'register',
        component: register
    },
    {
        // /business/login
        name: 'login',
        path: 'login',
        component: login
    },
    {
        name: 'BusinessIndex',
        path: 'index',
        component: BusinessIndex,
        meta: { auth: true },
    },
    {
        name: 'BusinessProfile',
        path: 'profile',
        component: BusinessProfile,
        meta: { auth: true },
    },
    {
        name: 'BusinessEmail',
        path: 'email',
        component: BusinessEmail,
        meta: { auth: true },
    },
]

//1级路由的组件
const layout = {
    template: `<router-view></router-view>`
}

// 组装一个客户的路由
export default {
    name: 'business',
    path: '/business', //1级路由
    component: layout, //组件
    children: children
}