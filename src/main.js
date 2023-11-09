import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//引入UI框架
import 'vant/lib/index.css'
import Vant from 'vant'

//引入路由
import router from './routers/index'

//引入封装的请求
import request from './services/request'

//封装的工具
import tools from './services/tools'

//引入cookie
import VueCookies from 'vue3-cookies'

// 创建一个vue应用
const app = createApp(App)   //vue
    .use(router)
    .use(Vant)
    .use(request)
    .use(tools)
    .use(VueCookies)
    .mount('#app')


//路由守卫
router.beforeEach(async (to, from, next) => {
    //to 这个参数代表 去到哪个路由
    //from 这个参数代表 从哪里来
    //next 这个参数代表 是否可以去到下一步
    var auth = to.meta.auth ? to.meta.auth : false

    //说明需要登录
    if (auth) {
        //获取cookie
        var cookie = app.$cookies.get('business') ? app.$cookies.get('business') : {}

        if (Object.getOwnPropertyNames(cookie).length <= 0) {
            app.$fail({
                message: '请先登录',
                duration: 1000,
            })

            next('/business/login')
            return false
        }

        //从cookie中获取出id和手机号
        var id = cookie.hasOwnProperty('id') ? cookie.id : 0
        var mobile = cookie.hasOwnProperty('mobile') ? cookie.mobile : ''

        if (!id || !mobile) {
            app.$cookies.remove('business')

            app.$fail({
                message: '非法登录',
                duration: 1000
            })

            next('/business/login');
            return false;
        }

        //做一个接口请求
        var result = await app.$POST({
            url: '/business/check',
            params: { id, mobile }
        })

        if (result.code == 0) {
            app.$cookies.remove('business')

            app.$fail({
                message: '非法登录',
                duration: 1000
            })

            next('/business/login');
            return false;
        }

        //覆盖一下cookie,把cookie弄成最新的
        app.$cookies.set('business', result.data);

        //通过
        next()
        return false
    } else {
        //不需要登录
        next()
        return false
    }
})