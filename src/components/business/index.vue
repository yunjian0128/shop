<template>
    <div class="myBox">
        <div class="L">
            <img :src="business.avatar_text" />
        </div>
        <div class="C">
            <div class="tit">{{ business.nickname }}</div>
            <div class="sub">{{ business.mobile }}</div>
        </div>
    </div>

    <div class="allkbox"></div>

    <div class="myboxcon">
        <router-link to="/business/profile">
            <p>基本资料</p>
            <img src="/assets/images/go.png">
        </router-link>
    </div>
    <div class="myboxcon" v-if="business.auth == '0'">
        <router-link to="/business/email">
            <p>邮箱认证</p>
            <img src="/assets/images/go.png">
        </router-link>
    </div>
    <div class="myboxcon">
        <router-link to="/address/index">
            <p>我的收货地址</p>
            <img src="/assets/images/go.png">
        </router-link>
    </div>
    <div class="myboxcon">
        <router-link to="/order/index">
            <p>我的订单</p>
            <img src="/assets/images/go.png">
        </router-link>
    </div>
    <div class="myboxcon">
        <router-link to="/record/index">
            <p>消费记录</p>
            <img src="/assets/images/go.png">
        </router-link>
    </div>
    <div class="myboxcon">
        <router-link to="/order/index">
            <p>充值记录</p>
            <img src="/assets/images/go.png">
        </router-link>
    </div>
    <div class="myboxcon">
        <a href="javascript:void(0)" @click="logout">
            <p>退出登录</p>
            <img src="/assets/images/go.png">
        </a>
    </div>

    <menus />
</template>

<script setup>
//相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

//获取cookie 创建响应式
var business = reactive(proxy.$cookies.get('business'))

// 退出方法
let logout = () => {
    proxy.$confirm({
        title: '退出提醒',
        message: '是否确认退出登录',
    }).then(() => {
        //删除cookie
        proxy.$cookies.remove('business')

        // 直接跳转
        proxy.$router.push('/business/login')

        return false
    }).catch(() => { })
}
</script>