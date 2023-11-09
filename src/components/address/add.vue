<template>
    <van-nav-bar title="添加收货地址" left-text="返回" left-arrow @click-left="back" />

    <van-address-edit :area-list="areaList" show-set-default :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save" />
</template>

<script setup>
import { areaList } from '@vant/area-data';

// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

// 获取到用户的信息
var business = reactive(proxy.$cookies.get('business'))

const back = () => {
    proxy.$router.go(-1)
    return false
}

// 接口请求
let save = async (info) => {

    // 组装数据
    var data = {
        busid: business.id,
        consignee: info.name,
        code: info.areaCode,
        address: info.addressDetail,
        mobile: info.tel,
        status: info.isDefault ? '1' : '0',
    }

    var result = await proxy.$POST({
        url: '/address/add',
        params: data
    })

    if (result.code == 0) {
        proxy.$fail(result.msg)
        return false
    } else {
        proxy.$success(result.msg)
        proxy.$router.go(-1)
    }
}


</script>