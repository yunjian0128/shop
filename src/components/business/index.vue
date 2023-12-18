<template>
    <div class="myBox">
        <div class="L">
            <img :src="business.avatar_text" />
        </div>
        <div class="C">
            <div class="tit">{{ business.nickname }}</div>
            <div class="sub">{{ business.mobile }}</div>
            <div class="sub" style="color: brown">
                余额：￥{{ business.money }}
                <van-button
                    type="primary"
                    size="mini"
                    block
                    style="width: auto"
                    @click="recharge"
                    >立即充值</van-button
                >
            </div>
        </div>
    </div>

    <div class="allkbox"></div>

    <router-link to="/business/profile">
        <div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/profile.png" />
                <p>基本资料</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <router-link to="/business/email" v-if="business.auth == '0'">
        <div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/email.png" />
                <p>邮箱认证</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <router-link to="/address/index"
        ><div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/address.png" />
                <p>我的收货地址</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <router-link to="/order/index">
        <div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/order.png" />
                <p>我的订单</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <router-link to="/business/record">
        <div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/record.png" />
                <p>消费记录</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <router-link to="/business/payrecord">
        <div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/recharge.png" />
                <p>充值记录</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <router-link to="" @click="logout">
        <div class="myboxcon">
            <div class="itext" style="display: flex; align-items: center">
                <img src="/assets/images/logout.png" />
                <p>退出登录</p>
            </div>
            <img src="/assets/images/go.png" />
        </div>
    </router-link>

    <menus />
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取cookie 创建响应式
var business = reactive(proxy.$cookies.get("business"));

// 退出方法
let logout = () => {
    proxy
        .$confirm({
            title: "退出提醒",
            message: "是否确认退出登录",
        })
        .then(() => {
            // 删除cookie
            proxy.$cookies.remove("business");

            // 直接跳转
            proxy.$router.push("/business/login");

            return false;
        })
        .catch(() => {});
};

// 立即充值
let recharge = () => {
    // 跳转到充值页面
    proxy.$router.push("/business/pay");
};
</script>
