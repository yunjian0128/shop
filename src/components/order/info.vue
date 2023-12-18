<template>
    <link href="/assets/css/indent-details.css" rel="stylesheet" />

    <van-nav-bar
        title="订单详情"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <div class="near-box">
        <div class="jd-qrdd-bigbox">
            <!--商品地址管理部分-->
            <div class="indent-details-box">
                <span class="indent-details-img1"></span>
                <span class="indent-details-text1">{{
                    order.status_text
                }}</span>
                <span class="indent-details-text2"
                    >物流信息：客户签收人：邮件收发 已签收
                    感谢使用圆通快递，期待再次为您服务！</span
                >
                <span class="indent-details-text3">2017-10-23 12:25:12</span>
            </div>
            <!--地址部分-->
            <div class="jd-qrdd-a1">
                <span class="qrdd-a1-t1">{{ order.consignee }}</span>
                <span class="qrdd-a1-t1">{{ order.mobile }}</span>
                <span class="qrdd-a1-t2" v-if="order.address_status == '1'"
                    >默认</span
                >
                <div class="qrdd-a1-b1">
                    <span class="qrdd-a1-img1"></span>
                    <span class="qrdd-a1-t3">{{ order.address }}</span>
                </div>
                <span class="qrdd-a1-img2"></span>
            </div>
            <!--商品部分-->
            <div class="zjzz-buylist-goods1">
                <div class="zjzz-buylist-gtime">
                    <span class="zjzz-buylist-gtime1"
                        ><i class="indent-details-img2"></i>官方旗舰店</span
                    >
                    <span class="zjzz-buylist-gtime2">联系客服</span>
                </div>
                <div class="zjzz-buylist-det">
                    <img :src="order.thumb_text" />
                    <div class="zjzz-buylist-gdetail">
                        <span class="zjzz-buylist-gtit1">{{
                            order.proname
                        }}</span>
                        <span class="zjzz-buylist-gmoney">
                            <i class="zjzz-buylist-gm1">￥{{ order.amount }}</i>
                            <i class="zjzz-buylist-gm2">x{{ order.pronum }}</i>
                        </span>
                    </div>
                </div>
                <div class="zjzz-buylist-btn">
                    <a class="zjzz-buylist-btn3">申请售后</a>
                </div>
            </div>
            <!--商品金额部分-->
            <div class="indent-details-box2">
                <span class="indent-details-text4">应付总额</span>
                <span class="indent-details-text5">￥{{ order.amount }}</span>
            </div>
            <div class="indent-details-box2">
                <span class="indent-details-text4 tcolor-grey">商品总价</span>
                <span class="indent-details-text5 tcolor-black"
                    >￥{{ order.amount }}</span
                >
            </div>
            <div class="indent-details-box2">
                <span class="indent-details-text4 tcolor-grey">运费</span>
                <span class="indent-details-text5 tcolor-black">￥0.00</span>
            </div>
            <div class="indent-details-box2">
                <span class="indent-details-text4 tcolor-grey">税费</span>
                <span class="indent-details-text5 tcolor-black">￥0.00</span>
            </div>
            <div class="indent-details-box2">
                <span class="indent-details-text4 tcolor-grey">发票信息</span>
                <span class="indent-details-text5 tcolor-black"
                    >不需要发票</span
                >
            </div>

            <!--订单编号部分-->
            <div class="indent-details-box3">
                <p>订单编号:{{ order.code }}</p>
                <p>支付方式:支付宝</p>
                <p>支付交易单号:201711024866544846144</p>
                <p>下单时间:{{ order.createtime_text }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));

let order = ref([]);

// 钩子函数
onBeforeMount(() => {
    // 请求列表
    OrderInfo();
});

// 返回
let back = () => {
    proxy.$router.go(-1);
    return false;
};

// 请求数据
let OrderInfo = async () => {
    // 封装数据
    var data = {
        busid: business.id,
        orderid: proxy.$route.query.orderid,
    };

    var result = await proxy.$POST({
        url: "/order/info",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    }

    order.value = result.data;
};
</script>
