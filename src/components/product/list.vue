<template>
  <!-- 导航栏 -->
  <van-nav-bar :title="TypeName" left-text="返回" left-arrow @click-left="back" @click-right="show = !show">
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>

  <!-- 搜索框 -->
  <van-popup v-model:show="show" position="top">
    <van-search v-model="keywords" placeholder="请输入关键词" @search="search" />
  </van-popup>

  <!-- 下拉列表 -->
  <van-dropdown-menu>
    <van-dropdown-item v-model="TypeActive" :options="TypeList" @change="TypeToggle" />
    <van-dropdown-item v-model="FlagActive" :options="FlagList" @change="FlagToggle" />
    <van-dropdown-item v-model="SortActive" :options="SortList" @change="SortToggle" />
    <van-dropdown-item v-model="ByActive" :options="ByList" @change="ByToggle" />
  </van-dropdown-menu>

  <!-- 数据列表 -->
  <van-pull-refresh v-model="refreshing" @refresh="refresh">
    <van-list v-model:loading="loading" :finished="finished" :offset="10" :immediate-check="false" finished-text="没有更多了"
      @load="load">
      <ul class="proul">
        <li v-for="item in list">
          <router-link :to="{ path: '/product/info', query: { proid: item.id } }">
            <img :src="item.thumb_text" />
          </router-link>
          <router-link :to="{ path: '/product/info', query: { proid: item.id } }">
            <p class="tit">{{ item.name }}</p>
          </router-link>
          <div class="price">
            <p>￥{{ item.price }}</p>
          </div>
        </li>
      </ul>
    </van-list>
  </van-pull-refresh>

  <!-- 返回顶部 -->
  <van-back-top right="20" bottom="60" />
</template>

<script setup>

// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

// 响应式数据
let TypeActive = proxy.$route.query.hasOwnProperty('typeid') ? proxy.$route.query.typeid : 0;
TypeActive = parseInt(TypeActive)
TypeActive = ref(TypeActive)
let keywords = ref('')
let TypeName = ref('全部商品')
let show = ref(false)
let FlagActive = ref('0')
let SortActive = ref('createtime')
let ByActive = ref('desc')
let SearchShow = ref(false)

// 下拉刷新
let list = ref([])
let page = ref(1)
let loading = ref(false)
let finished = ref(false)
let refreshing = ref(false)

let FlagList = [
  { text: '全部商品', value: '0' },
  { text: '新品', value: '1' },
  { text: '热销', value: '2' },
  { text: '推荐', value: '3' },
];

let TypeList = reactive([
  { text: '全部分类', value: 0 },
]);

let SortList = [
  { text: '按上架时间', value: 'createtime' },
  { text: '按价格', value: 'price' },
  { text: '按库存', value: 'stock' }
];

let ByList = [
  { text: '降序', value: 'desc' },
  { text: '升序', value: 'asc' },
];

//挂载前
onBeforeMount(() => {
  type()
  load()
})

//下拉刷新的方法
const refresh = async () => {
  page.value = 1
  list.value = []
  finished.value = false
  loading.value = true
  load()
}

//分类的请求
const type = async () => {
  var result = await proxy.$POST({
    url: '/index/type',
    params: {}
  })

  if (result.code == 0) {
    proxy.$fail(result.msg)
    return false
  }

  for (var item of result.data) {
    TypeList.push({
      text: item.name,
      value: item.id
    })
  }
}

//加载数据
const load = async () => {
  //如果刷新状态已经为true了，就要修改为false
  if (refreshing.value) {
    refreshing.value = false
  }

  //组装数据
  var data = {
    typeid: TypeActive.value,
    flag: FlagActive.value,
    sort: SortActive.value,
    by: ByActive.value,
    keywords: keywords.value,
    page: page.value
  }

  var result = await proxy.$POST({
    url: "/index/list",
    params: data
  })

  //请求发送完毕后，加载状态也就完毕了
  loading.value = false

  if (result.code == 0) {
    finished.value = true
  } else {
    list.value = list.value.concat(result.data.list)
    page.value++

    TypeName.value = result.data.TypeName
  }
}


//分类切换
const TypeToggle = async (value) => {
  TypeActive.value = value
  refresh()
}

//属性切换
const FlagToggle = async (value) => {
  FlagActive.value = value
  refresh()
}

//排序切换
const SortToggle = async (value) => {
  SortActive.value = value
  refresh()
}

//排序切换
const ByToggle = async (value) => {
  ByActive.value = value
  refresh()
}

const back = () => {
  proxy.$router.go(-1)
  return false
}

const search = () => {
  show.value = false
  refresh()
}

</script>

<style>
ul.proul {
  margin-bottom: 30px;
}
</style>