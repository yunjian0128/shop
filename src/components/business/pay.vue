<template>
    <van-nav-bar
        title="余额充值"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-form label-width="100px" @submit="pay">
        <van-field v-model="business.money" label="当前您的余额" readonly />

        <van-field
            v-model="money"
            name="money"
            label="请输入充值金额"
            placeholder="请输入充值金额"
            :rules="rules.money"
        />

        <!-- <van-field name="type" label="支付方式">
            <template #input>
                <van-radio-group v-model="checked" direction="horizontal">
                    <van-radio name="wx">微信</van-radio>
                    <van-radio name="zfb">支付宝</van-radio>
                </van-radio-group>
            </template>
        </van-field> -->

        <!-- 支付方式 -->
        <van-field name="type" label="支付方式">
            <template #input>
                <van-radio-group v-model="checked">
                    <van-radio name="wx"
                        ><div style="display: flex; flex-direction: column">
                            微信支付
                            <van-icon
                                name="wechat"
                                color="#15ba11"
                                size="50px"
                            />
                        </div>
                    </van-radio>
                    <van-radio name="zfb">
                        <div style="display: flex; flex-direction: column">
                            支付宝支付
                            <van-icon
                                name="alipay"
                                color="#009fe8"
                                size="50px"
                            />
                        </div>
                    </van-radio>
                </van-radio-group>
            </template>
        </van-field>

        <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
                提交
            </van-button>
        </div>
    </van-form>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取cookie 创建响应式
var business = reactive(proxy.$cookies.get("business"));

var money = ref(1);
var checked = ref("wx");

let rules = {
    money: [
        { required: true, message: "请填写充值的金额" },
        { pattern: /[1-9]|[1-9]\d*/, message: "你填写的充值金额有误" },
    ],
};

const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 充值方法
const pay = async (values) => {
    // 组装数据
    var data = {
        money: money.value,
        type: checked.value,
    };

    proxy.$router.push({ path: "/business/confirm", query: data });
};
</script>

<style>
:root {
    --van-uploader-size: 150px;
    --van-uploader-border-radius: 100px;
}
</style>
