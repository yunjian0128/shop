<template>
    <link rel="stylesheet" href="/assets/css/order.css" />

    <van-nav-bar title="订单列表" left-text="返回" left-arrow @click-left="back" />

    <!-- 选项卡 -->
    <van-tabs v-model:active="active" @change="TabChange">
        <van-tab title="全部订单" name="0"></van-tab>
        <van-tab title="已支付" name="1"></van-tab>
        <van-tab title="已发货" name="2"></van-tab>
        <van-tab title="已收货" name="3"></van-tab>
        <van-tab title="仅退款" name="-1"></van-tab>
        <van-tab title="退货退款" name="-2"></van-tab>
        <van-tab title="退货中" name="-3"></van-tab>
        <van-tab title="退货成功" name="-4"></van-tab>
        <van-tab title="退货失败" name="-5"></van-tab>
    </van-tabs>

    <!-- 下拉列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="refresh">
        <van-list v-model:loading="loading" :finished="finished" :offset="10" :immediate-check="false" finished-text="没有更多了"
            @load="load">
            <div class="list-box">
                <div class="list">
                    <div class="item" v-for="order in list">
                        <div class="item-left">
                            <img src="/assets/images/02.jpg" alt="">
                        </div>
                        <div class="item-right">
                            <div class="item">订单编号：{{ order.code }}</div>
                            <div class="item">商品名称：7999卧室套餐</div>
                            <div class="item">下单时间：{{ order.createtime_text }}</div>
                            <div class="item">订单金额：￥{{ order.amount }}</div>
                            <div class="item">订单状态：{{ order.status_text }}</div>

                            <div class="btn-box">
                                <van-button type="primary" size="small">详情</van-button>

                                <van-button type="success" size="small" v-if="order.status == '2'">确认收货</van-button>
                                <van-button type="default" size="small" v-if="order.status == '2' && order.expresscode"
                                    @click="express(order.id)">查看物流</van-button>

                                <van-button type="warning" size="small" v-if="order.status == '3'">评价</van-button>

                                <van-button type="danger" size="small"
                                    v-if="order.status == '1' || order.status == '2'">退货</van-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </van-pull-refresh>
</template>

<script setup>
//相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

//获取到用户的信息
var business = reactive(proxy.$cookies.get('business'))
let active = ref(0)
let list = ref([])
let loading = ref(false)
let finished = ref(false)
let refreshing = ref(false)
let page = ref(1)

//钩子函数
onBeforeMount(() => {
    //请求列表
    OrderData()
})

const back = () => {
    proxy.$router.go(-1)
    return false
}

//接口请求
let OrderData = async () => {
    //封装数据
    var data = {
        busid: business.id,
        page: page.value,
        status: active.value
    }

    var result = await proxy.$POST({
        url: '/order/index',
        params: data
    })

    //请求发送完毕后，加载状态也就完毕了
    loading.value = false

    if (result.code == 0) {
        finished.value = true
    } else {
        list.value = list.value.concat(result.data)
        page.value++
    }
}

// 选项卡切换
let TabChange = async () => {
    page.value = 1
    list.value = []
    finished.value = false
    loading.value = true
    load()
}

// 下拉刷新
let refresh = async () => {
    page.value = 1
    list.value = []
    finished.value = false
    loading.value = true
    load()
}

// 上拉加载
let load = async () => {
    // 如果刷新状态已经为true了，就要修改为false
    if (refreshing.value) {
        refreshing.value = false
    }

    OrderData()
}
</script>