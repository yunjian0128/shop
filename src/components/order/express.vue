<template>
    <van-nav-bar
        title="物流进度"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <!-- 联系人 -->
    <van-contact-card type="edit" :name="name" :tel="phone" :editable="false" />

    <!-- 物流进度 -->
    <van-steps direction="vertical" :active="0">
        <van-step v-for="item in list">
            <h3>{{ item.AcceptStation }}</h3>
            <p>{{ item.AcceptTime }}</p>
        </van-step>
    </van-steps>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));
var orderid = proxy.$route.query.orderid ? proxy.$route.query.orderid : 0;
orderid = ref(orderid);

// 物流信息
var list = ref([]);
var name = ref("");
var phone = ref("");

// 钩子函数
onBeforeMount(() => {
    // 请求列表
    ExpressData();
});

// 返回
const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 接口请求
let ExpressData = async () => {
    // 封装数据
    var data = {
        busid: business.id,
        orderid: orderid.value,
    };

    var result = await proxy.$POST({
        url: "/order/express",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    }

    name.value = result.data.name;
    phone.value = result.data.phone;
    list.value = result.data.list.reverse();
};
</script>
