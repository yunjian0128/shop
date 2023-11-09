<template>
  <!-- 头部 -->
  <div class="topBox">
    <div class="L"><a href="index.html">LOGO</a></div>
    <div class="C">
      <div class="saerchbox">
        <input name="" type="text" placeholder="请输入您要搜索的内容"><img src="/assets/images/ss.png">
      </div>
    </div>
    <div class="R"><img src="/assets/images/tr.png"></div>
  </div>

  <!-- 轮播图 -->
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="item in top">
      <van-image width="100%" height="100%" fit="fill" :src="item.thumbs_text" />
    </van-swipe-item>
  </van-swipe>

  <!-- 分类 -->
  <div class="lqgwBox">
    <ul>
      <li v-for="item in type">
        <router-link :to="{ path: '/product/list', query: { typeid: item.id } }">
          <img :src="item.thumb_text" />
          <p>{{ item.name }}</p>
        </router-link>
      </li>
    </ul>
  </div>

  <!-- 广告图 -->
  <div class="adBox">
    <img src="/assets/images/banner.jpg">
  </div>

  <!-- 推荐商品 -->
  <ul class="proul">
    <li v-for="item in news">
      <div class="con">
        <a href="detail.html">
          <img :src="item.thumbs_text">
          <p><span>￥</span>{{ item.price }}</p>
        </a>
      </div>
    </li>
  </ul>

  <!-- 底部 -->
  <menus />
</template>

<script setup>

import { getCurrentInstance } from 'vue' // 相当于vue2 选项式API当中的 this对象
const { proxy } = getCurrentInstance() // 获取到用户的信息

var news = ref([])
var type = ref([])
var top = ref([])

onBeforeMount(() => {
  home() // 请求列表
})

// 接口请求
let home = async () => {
  var result = await proxy.$POST({
    url: '/index/index',
    params: {}
  })

  top.value = result.data.top
  type.value = result.data.type
  news.value = result.data.news
}


</script>

<style>
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