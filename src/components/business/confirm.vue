<template>
    <van-nav-bar
        title="收银台"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <h3 class="PayTitle">提示：付款金额要与显示的金额一致，否则后果自负</h3>

    <div class="PayAmount">
        <span>￥</span>
        <span>{{ pay.price }}元</span>
    </div>

    <div class="PayCode">
        <img v-if="type == 'wx'" :src="pay.wxcode" />
        <img v-else :src="pay.zfbcode" />
    </div>

    <div class="PayInfo">
        <div class="name">订单名称：{{ pay.name }}</div>
        <div class="code">订单号：{{ pay.code }}</div>
        <div class="box">
            <span class="tip">订单支付有效期</span>
            <span class="sec">{{ sec }} 秒</span>
        </div>
    </div>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取cookie 创建响应式
var business = reactive(proxy.$cookies.get("business"));

var money = proxy.$route.query.money ? proxy.$route.query.money : 1;
money = ref(money);

var type = proxy.$route.query.type ? proxy.$route.query.type : "wx";
type = ref(type);

var pay = ref({});

var sec = ref(180);

onBeforeMount(() => {
    request();
});

//定时器
var T;
const autoplay = async () => {
    if (sec.value <= 0) {
        pay.value.wxcode = "/assets/images/pay/qrcode_timeout.png";
        pay.value.zfbcode = "/assets/images/pay/qrcode_timeout.png";
        clearInterval(T);
    } else {
        sec.value--;
    }

    if (sec.value % 5 == 0) {
        await PayQuery();
    }
};

const back = () => {
    proxy.$router.go(-1);
    return false;
};

//充值方法
const request = async (values) => {
    //组装数据
    var data = {
        busid: business.id,
        money: money.value,
        type: type.value,
    };

    var result = await proxy.$POST({
        url: "/business/pay",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    }

    pay.value = result.data;

    T = setInterval(autoplay, 1000);
};

// 查询充值是否成功
const PayQuery = async () => {
    if (sec.value <= 0) {
        return false;
    }

    //组装数据
    var data = {
        busid: business.id,
        payid: pay.value.id,
    };

    var result = await proxy.$POST({
        url: "/business/query",
        params: data,
    });

    var status = result.data.status ? result.data.status : 0;

    if (status == "1") {
        clearInterval(T);

        proxy.$success({
            title: "支付提醒",
            message: "支付成功",
            duration: 3000,
            onClose: () => {
                proxy.$router.push("/business/pay");
            },
        });
    }
};
</script>

<style>
:root {
    --van-uploader-size: 150px;
    --van-uploader-border-radius: 100px;
}

.PayTitle {
    text-align: center;
    color: red;
    font-size: 1.3em;
    margin-top: 2em;
    margin-bottom: 1em;
}

.PayAmount {
    text-align: center;
    margin-bottom: 1em;
}

.PayAmount span:first-child {
    font-size: 1.6em;
}

.PayAmount span:last-child {
    font-size: 2.4em;
}

.PayCode {
    width: 70%;
    margin: 0 auto;
}

.PayCode img {
    width: 100%;
}

.PayInfo {
    text-align: center;
    color: #000;
    font-size: 1.2em;
    font-weight: bold;
}

.PayInfo .box {
    margin-top: 1em;
}

.PayInfo .box span {
    background: #3ec742;
    color: #fff;
    line-height: 25px;
    font-size: 15px;
    font-family: Arial;
    padding: 0 10px;
    margin-right: 10px;
    border-radius: 5px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
