//引入路由对象
import { createRouter, createWebHashHistory } from 'vue-router'

//引入当前目录下面所有的JS文件
const modfile = import.meta.globEager('./*.js')

//路由集合
const RouterList = []

// console.log(Object.keys(modfile)) //提取对象中所有的key 放到一个数组中
// console.log(Object.values(modfile)) //提取对象中所有的value 放到一个数组中
Object.values(modfile).map(async mod => {
    if (mod.default) await RouterList.push(mod.default)
})


//创建路由对象
export default createRouter({
    history: createWebHashHistory(), //设置路由模式
    linkExactActiveClass: 'active', //当前所匹配的链接
    routes: RouterList, //路由列表
})