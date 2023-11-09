<template>
    <van-nav-bar title="确认订单" left-text="返回" left-arrow @click-left="back" />

    <!-- 收货地址 -->
    <van-contact-card v-if="address" type="edit" :tel="address.tel" :name="address.name" @click="ToggleAddress" />
    <van-contact-card v-else type="add" @click="AddressAdd" />

    <!-- 购物车列表 -->
    <div class="cart-confirm" v-for="cart in cartlist">
        <!-- 商品卡片 -->
        <van-card class="goods-card" :title="cart.product.name" :price="cart.total" :thumb="cart.product.thumb_text"
            :num="cart.nums">
            <template #desc>
                <div style="color: #969799">库存：{{ cart.product.stock }}</div>
                <div>单价：{{ cart.price }}</div>
            </template>
        </van-card>
    </div>

    <!-- 订单备注 -->
    <van-cell-group inset>
        <van-field v-model="remark" rows="2" autosize type="textarea" maxlength="100" placeholder="请输入订单备注"
            show-word-limit />
    </van-cell-group>

    <!-- 提交订单栏 -->
    <van-submit-bar :price="price" button-text="立即下单" @submit="submit" />
</template>

<script setup>
//相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

//接收要下单的购物车id
var ids = proxy.$route.query.ids ? proxy.$route.query.ids : ''
ids = ref(ids)


let address = proxy.$cookies.get('address') ? proxy.$cookies.get('address') : null
address = ref(address)

//获取到用户的信息
var business = reactive(proxy.$cookies.get('business'))

let cartlist = ref([])
let remark = ref('')

let price = computed(() => {
    var total = 0;

    cartlist.value.map(item => {
        //合算
        total += parseFloat(item.total)
    })

    return parseFloat(total * 100);
})

//钩子函数
onBeforeMount(() => {
    //请求列表
    CartData()
    AddressData()
})

const back = () => {
    proxy.$router.go(-1)
    return false
}

//接口请求
let CartData = async () => {
    //组装数据
    var data = {
        busid: business.id,
        ids: ids.value
    }

    var result = await proxy.$POST({
        url: '/cart/index',
        params: data
    })

    if (result.code == 0) {
        proxy.$fail(result.msg)
        cartlist.value = []
        return false
    }

    cartlist.value = result.data
}

let AddressData = async () => {
    //当收货地址为空的时候才去请求
    if (address.value) {
        return false;
    }

    //组装数据
    var data = {
        busid: business.id,
    }

    var result = await proxy.$POST({
        url: '/cart/address',
        params: data
    })

    if (result.code == 0) {
        proxy.$fail(result.msg)
        return false
    }

    address.value = {
        tel: `${result.data.mobile}(${result.data.consignee})`,
        name: `${result.data.region_text} ${result.data.address}`,
        id: result.data.id
    }
}

//跳转到添加收货地址的界面
let AddressAdd = () => {
    proxy.$router.push('/address/add')
    return false
}

//切换收货地址
let ToggleAddress = () => {
    proxy.$router.push({ path: '/address/index', query: { action: 'toggle' } })
}

// 提交订单 -> 结算界面
let submit = async () => {
    proxy.$confirm({
        title: '下单提醒',
        message: '是否确认立即下单'
    }).then(async () => {
        //组装数据
        var data = {
            cartids: ids.value,
            busid: business.id,
            addrid: address.value.id,
            remark: remark.value
        }

        //发起请求
        var result = await proxy.$POST({
            url: '/order/add',
            params: data
        })

        if (result.code == 0) {
            proxy.$fail(result.msg)
            return false
        } else {
            proxy.$success(result.msg)

            proxy.$router.push(result.url)
            return false
        }

    }).catch(err => {
        console.log(err);
    })
}
</script>



<style>
.cart-confirm {
    display: block;
    width: 100%;
    background: var(--van-card-background);
}
</style>