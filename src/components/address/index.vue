<template>
    <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="back" />
    <van-address-list v-model="choose" :list="list" default-tag-text="默认" @add="onAdd" @edit="onEdit" />
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

// 获取到用户的信息
var business = reactive(proxy.$cookies.get('business'))

let list = reactive([])
let choose = ref(0)

// 钩子函数
onBeforeMount(() => {
    // 请求列表
    Address()
})

const back = () => {
    proxy.$router.go(-1)
    return false
}

// 接口请求
let Address = async () => {
    var result = await proxy.$POST({
        url: '/address/index',
        params: { busid: business.id }
    })

    if (result.code == 0) {
        proxy.$fail(result.msg)
        return false
    }

    // 循环遍历
    for (var item of result.data) {
        if (item.status == '1') {
            choose.value = item.id
        }

        list.push({
            id: item.id,
            name: item.consignee,
            tel: item.mobile,
            address: item.region_text + item.address,
            isDefault: item.status == '1' ? true : false
        })
    }
}

const onAdd = () => proxy.$router.push('/address/add');

const onEdit = (item, index) => {
    proxy.$router.push({
        path: '/address/edit',
        query: { id: item.id }
    })
}
</script>