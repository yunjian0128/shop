<template>
    <van-nav-bar title="评价" left-text="返回" left-arrow @click-left="back" />

    <!-- 订单详情 -->
    <div
        class="item"
        style="
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 2em;
        "
    >
        <div class="item-left" style="width: 45%">
            <img :src="order.thumb_text" />
        </div>
        <div class="item-right" style="margin-left: 2%; width: 45%">
            <div class="item">订单编号：{{ order.code }}</div>
            <div class="item">商品名称：{{ order.proname }}</div>
            <div class="item">下单时间：{{ order.createtime_text }}</div>
            <div class="item">订单金额：￥{{ order.amount }}</div>
            <div class="item">订单状态：{{ order.status_text }}</div>
        </div>
    </div>

    <!-- 评价 -->
    <van-form @submit="comment">
        <van-cell-group inset>
            <van-field
                v-model="content"
                rows="2"
                name="content"
                autosize
                type="textarea"
                maxlength="100"
                placeholder="请输入评价内容"
                show-word-limit
                :rules="rules.content"
            />

            <van-row justify="center">
                <van-col>
                    <van-field name="thumbs">
                        <template #input>
                            <van-uploader
                                multiple
                                upload-text="上传评价图片"
                                v-model="thumbs"
                                max-count="1"
                            >
                            </van-uploader>
                        </template>
                    </van-field>
                </van-col>
            </van-row>

            <van-button
                round
                block
                type="primary"
                native-type="submit"
                :style="{ marginTop: '40px' }"
            >
                提交
            </van-button>
        </van-cell-group>
    </van-form>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));
var orderid = proxy.$route.query.orderid ? proxy.$route.query.orderid : 0;
orderid = ref(orderid);

// 评价内容
const rules = {
    content: [
        {
            required: true,
            message: "请输入评价内容",
            trigger: "blur",
        },
    ],
};

// 订单详情
let order = ref([]);

// 评价内容
let content = ref("");

// 评价图片
let thumbs = ref([]);

// 钩子函数
onBeforeMount(() => {
    // 请求列表
    OrderData();
});

// 返回
const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 接口请求
let OrderData = async () => {
    // 封装数据
    var data = {
        busid: business.id,
        orderid: orderid.value,
    };

    // 发起请求
    var result = await proxy.$POST({
        url: "/order/info",
        params: data,
    });

    order.value = result.data;
};

// 提交评价
const comment = async (values) => {
    // 判断用户是否登录
    if (!business) {
        proxy.$fail("请先登录");
        return false;
    }
    // 判断是否为空
    if (content.value == "") {
        proxy.$fail("请输入评价内容");
        return false;
    }

    // 组装数据
    var data = {
        busid: business.id,
        orderid: orderid.value,
        content: values.content,
    };

    // 上传图片
    if (values.thumbs[0] == undefined) {
        // 发起POST请求
        var result = await proxy.$POST({
            url: "/order/comment",
            params: data,
        });

        if (result.code == 0) {
            proxy.$fail(result.msg);
            return false;
        } else {
            proxy.$success(result.msg);
            proxy.$router.go(-1);
        }
    } else {
        // 上传图片
        data.thumbs = values.thumbs[0].file;

        var result = await proxy.$UPLOAD({
            url: "/order/comment",
            params: data,
        });

        if (result.code == 0) {
            proxy.$fail(result.msg);
            return false;
        } else {
            proxy.$success(result.msg);
            proxy.$router.go(-1);
        }
    }

    // 发起请求
    // var result = await proxy.$UPLOAD({
    //     url: "/order/comment",
    //     params: data,
    // });

    // if (result.code == 0) {
    //     proxy.$fail(result.msg);
    //     return false;
    // } else {
    //     proxy.$success(result.msg);
    //     proxy.$router.go(-1);
    // }
};
</script>
