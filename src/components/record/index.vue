<template>
    <van-nav-bar title="消费记录" left-text="返回" left-arrow @click-left="back" />
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

// 获取到用户的信息
var business = reactive(proxy.$cookies.get('business'))
let active = ref(0)
let list = ref([])
let loading = ref(false)
let finished = ref(false)
let refreshing = ref(false)
let page = ref(1)

// 钩子函数
onBeforeMount(() => {

    // 请求列表
    OrderData()
})

const back = () => {
    proxy.$router.go(-1)
    return false
}

// 接口请求
let OrderData = async () => {

    // 封装数据
    var data = {
        busid: business.id,
        page: page.value,
        status: active.value
    }

    var result = await proxy.$POST({
        url: '/business/record',
        params: data
    })

    // 请求发送完毕后，加载状态也就完毕了
    loading.value = false

    if (result.code == 0) {
        finished.value = true
    } else {
        // console.log(result);
        // return;
        list.value = list.value.concat(result.data)
        page.value++
    }
}

// 选项卡切换
let TabChange = async () => {
    page.value = 1
    list.value = []
    finished.value = false
    loading.value = true
    load()
}

// 下拉刷新
let refresh = async () => {
    page.value = 1
    list.value = []
    finished.value = false
    loading.value = true
    load()
}

// 上拉加载
let load = async () => {
    // 如果刷新状态已经为true了，就要修改为false
    if (refreshing.value) {
        refreshing.value = false
    }

    OrderData()
}
</script>