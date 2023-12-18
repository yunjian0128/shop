<template>
    <!-- 头部 -->
    <div class="topBox">
        <div class="L">
            <router-link
                style="
                    display: block;
                    width: 100%;
                    height: 100%;
                    font-family: 'QianTuXiaoTuTi', sans-serif;
                "
                :to="{ path: '/business/index' }"
                >大麦商城</router-link
            >
        </div>

        <div class="C">
            <div class="saerchbox">
                <input
                    v-model="keywords"
                    type="text"
                    placeholder="请输入您要搜索的内容"
                    @change="search"
                />
                <img src="/assets/images/ss.png" />
            </div>
        </div>
        <div class="R"><img src="/assets/images/damai.png" /></div>
    </div>

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in top">
            <router-link
                :to="{ path: '/product/info', query: { proid: item.id } }"
            >
                <van-image
                    width="100%"
                    height="100%"
                    fit="fill"
                    :src="item.thumb_text"
                />
            </router-link>
        </van-swipe-item>
    </van-swipe>

    <!-- 分类 -->
    <div class="lqgwBox">
        <ul>
            <li v-for="item in type">
                <router-link
                    :to="{ path: '/product/list', query: { typeid: item.id } }"
                >
                    <img :src="item.thumb_text" />
                    <p>{{ item.name }}</p>
                </router-link>
            </li>
        </ul>
    </div>

    <!-- 广告图 -->
    <div class="adBox">
        <a
            href="https://s1.mi.com/pages/1f490b64a7d1716e9952d627b9baa45e/index.html?spmref=MiShop_M.cms_26.3038946.1&scmref=cms.0.0.0.page.0.0.0"
        >
            <img src="/assets/images/banner.webp"
        /></a>
    </div>

    <!-- 推荐商品 -->
    <van-pull-refresh v-model="refreshing" @refresh="refresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            :offset="10"
            :immediate-check="false"
            finished-text="没有更多了"
            @load="load"
        >
            <div class="list-box">
                <ul class="proul">
                    <li v-for="item in news">
                        <div class="con">
                            <router-link
                                :to="{
                                    path: '/product/info',
                                    query: { proid: item.id },
                                }"
                            >
                                <img :src="item.thumb_text" />
                                <p><span>￥</span>{{ item.price }}</p>
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </van-list>
    </van-pull-refresh>

    <!-- 底部 -->
    <menus />
</template>

<script setup>
import { getCurrentInstance } from "vue"; // 相当于vue2 选项式API当中的 this对象
const { proxy } = getCurrentInstance(); // 获取到用户的信息

var news = ref([]);
var type = ref([]);
var top = ref([]);
let keywords = ref("");
let loading = ref(false);
let finished = ref(false);
let refreshing = ref(false);
let page = ref(1);

onBeforeMount(() => {
    home(); // 请求列表
});

// 接口请求
let home = async () => {
    var result = await proxy.$POST({
        url: "/index/index",
        params: {},
    });

    top.value = result.data.top;
    type.value = result.data.type;
    news.value = result.data.news;
};

// 搜索
let search = () => {
    if (keywords.value == "") {
        proxy.$toast("请输入搜索内容");
        return false;
    }

    proxy.$router.push({
        path: "/product/list",
        query: { keywords: keywords.value },
    });
};

// 下拉刷新
let refresh = async () => {
    page.value = 1;
    list.value = [];
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

    await home();
};
</script>

<style>
.topBox {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 999;
}
ul.proul {
    display: flex;
    flex-wrap: wrap;
}

ul.proul li {
    float: none;
}

.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    height: 300px;
    text-align: center;
    background-color: black;
    overflow: hidden;
}
</style>
