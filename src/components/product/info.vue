<template>
  <!-- 导航栏 -->
  <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="back" @click-right="show = !show">
    <template #right>
      <van-icon name="share-o" size="18" @click="ShareShow = true" />
    </template>
  </van-nav-bar>

  <!-- 轮播图 -->
  <van-swipe :autoplay="3000" indicator-color="black">
    <van-swipe-item v-for="pic in product.thumbs_text">
      <van-image width="100%" height="100%" fit="fill" :src="pic" />
    </van-swipe-item>
  </van-swipe>

  <!-- 商品信息 -->
  <div class="detailbox">
    <h4>{{ product.name }} - ({{ product.category ? product.category.name : '' }})</h4>
    <div class="price"><em>￥</em>{{ product.price }}
      <b>库存：{{ product.stock }} {{ product.unit ? product.unit.name : '' }}</b>
    </div>
  </div>

  <div class="allkbox"></div>

  <!-- 商品参数 -->
  <div class="detailbox_2">
    <p class="tit">产品参数：</p>
    <div v-html="product.content"></div>
  </div>

  <!-- 分享面板 -->
  <van-share-sheet v-model:show="ShareShow" title="立即分享给好友" :options="options" @select="share" />

  <!-- 返回顶部 -->
  <van-back-top right="20" bottom="60" />

  <!-- 动作栏 -->
  <van-action-bar>
    <van-action-bar-icon icon="chat-o" text="客服" dot @click="contact" />
    <van-action-bar-icon icon="cart-o" text="购物车" @click="Tocart" :badge="count" v-if="count > 0" />
    <van-action-bar-icon icon="cart-o" text="购物车" @click="Tocart" v-else />
    <van-action-bar-button type="warning" text="加入购物车" @click="AddCart" />
    <van-action-bar-button type="danger" text="立即购买" />
  </van-action-bar>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

// 获取cookie 创建响应式
var business = reactive(proxy.$cookies.get('business'))

// 响应式数据
let proid = proxy.$route.query.hasOwnProperty('proid') ? proxy.$route.query.proid : 0;
proid = ref(proid)
let product = ref({})
let count = ref(0)
let ShareShow = ref(false)
const options = [
  [
    { name: '微信', icon: 'wechat' },
    { name: '朋友圈', icon: 'wechat-moments' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' },
  ],
  [
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
    { name: '小程序码', icon: 'weapp-qrcode' },
  ],
];


// 挂载前
onBeforeMount(() => {
  request()
  ProductCount()
})

// 返回
const back = () => {
  proxy.$router.go(-1)
  return false
}

//跳转到购物车
const Tocart = () => {
  proxy.$router.push('/cart/index')
  return false
}

//分享点击方法
const share = (options) => {
  ShareShow.value = false
  console.log(options)
}

//拨打电话
const contact = async () => {
  proxy.$confirm({
    title: '电话提醒',
    message: '是否拨打客服热线',
  }).then(() => {
    location.href = `tel:13512633445`
  }).catch(() => { })
}

const request = async () => {
  var result = await proxy.$POST({
    url: '/index/product',
    params: { proid: proid.value }
  })

  if (result.code == 0) {
    proxy.$fail(result.msg)
    return false
  }

  product.value = result.data
}

// 获取购物车数量
const ProductCount = async () => {

  // 用户已登录才能进行下面的请求
  if (Object.getOwnPropertyNames(business).length <= 0) {
    return false
  }

  // 获取用户id
  var data = { busid: business.id }

  // 发起请求
  var result = await proxy.$POST({
    url: '/index/count',
    params: data
  })

  if (result.code == 0) {
    proxy.$fail(result.msg)
    return false
  }

  count.value = result.data
}

// 购物车添加
const AddCart = async () => {

  // 用户已登录才能进行下面的请求
  if (Object.getOwnPropertyNames(business).length <= 0) {
    proxy.$fail('请先登录')
    return false
  }

  // 组装数据
  var data = {
    busid: business.id,
    proid: proid.value,
  }

  // 发起请求
  var result = await proxy.$POST({
    url: '/cart/add',
    params: data
  })

  if (result.code == 0) {
    proxy.$fail(result.msg)
    return false
  }

  // 更新购物车数量
  ProductCount()

  proxy.confirm({
    title: result.msg,
    message: '是否跳转到购物车进行结算',
  }).then(() => {
    proxy.$router.push('/cart/index')
  }).catch((err) => {
    console.log(err)
  })
}

</script>