<template>
    <van-nav-bar
        title="充值记录"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <!-- 商品卡片 -->
    <van-pull-refresh v-model="refreshing" @refresh="refresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            :offset="10"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="load"
        >
            <van-swipe-cell v-for="item in record">
                <van-card class="record-card">
                    <template #desc>
                        <div>
                            消费金额:￥<span style="">{{ item.total }}</span>
                        </div>
                        <div style="color: #969799">
                            消费描述:{{ item.content }}
                        </div>
                        <div>消费时间:{{ item.createtime_text }}</div>
                    </template>
                </van-card>
                <template #right>
                    <van-button
                        square
                        style="height: 100%"
                        type="danger"
                        text="删除"
                        @click="Delete(item.id)"
                    />
                </template>
            </van-swipe-cell>
        </van-list>
    </van-pull-refresh>

    <!-- 确认删除弹框 -->
    <van-dialog
        v-model:show="show"
        title="删除提示"
        message="确认删除该条记录吗？"
        :show-cancel-button="true"
        @confirm="DeleteConfirm"
    />

    <!-- 返回顶部 -->
    <van-back-top right="20" bottom="60" />
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));

let record = ref([]);
let loading = ref(false);
let finished = ref(false);
let refreshing = ref(false);
let page = ref(1);
let show = ref(false);
let rid = ref(0);

// 钩子函数
onBeforeMount(() => {
    // 请求列表
    RecondData();
});

const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 接口请求
let RecondData = async () => {
    // 组装数据
    var data = {
        busid: business.id,
        page: page.value,
    };

    var result = await proxy.$POST({
        url: "/business/payrecord",
        params: data,
    });

    // 请求发送完毕后，加载状态也就完毕了
    loading.value = false;

    if (result.code == 0) {
        proxy.$fail(result.msg);
        finished.value = true;
        return false;
    }

    record.value = record.value.concat(result.data);
    page.value++;

    // 将record数据中的total的值，转换为浮点型，并去掉负号
    record.value.forEach((item) => {
        item.total = parseFloat(item.total);
    });
    return false;
};

// 删除
let Delete = (id) => {
    show.value = true;
    rid.value = id;
};

// 确认删除
let DeleteConfirm = async () => {
    show.value = false;

    // 组装数据
    var data = {
        rid: rid.value,
        busid: business.id,
    };

    var result = await proxy.$POST({
        url: "/business/delete",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    }

    proxy.$success(result.msg);
    show.value = false;
    record.value = [];
    page.value = 1;
    RecondData();
};

// 下拉刷新
let refresh = async () => {
    page.value = 1;
    record.value = [];
    finished.value = false;
    loading.value = true;
    load();
};

// 上拉加载
let load = async () => {
    // 如果刷新状态已经为true了，就要修改为false
    if (refreshing.value) {
        refreshing.value = false;
    }

    await RecondData();
};
</script>

<style>
.record-card {
    margin: 5px 0;
}
</style>
