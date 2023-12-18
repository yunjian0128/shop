<template>
    <van-nav-bar
        title="购物车"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <!-- 购物车列表 -->
    <van-checkbox-group v-model="checked" @change="CheckList">
        <div class="cart" v-for="cart in cartlist">
            <!-- 复选框 -->
            <van-checkbox :name="cart.id"></van-checkbox>

            <!-- 滑动单元格 -->
            <van-swipe-cell>
                <!-- 商品卡片 -->
                <van-card
                    class="goods-card"
                    :title="cart.product.name"
                    :price="cart.total"
                    :thumb="cart.product.thumb_text"
                >
                    <template #desc>
                        <div style="color: #969799">
                            库存：{{ cart.product.stock }}
                        </div>
                        <div>单价：{{ cart.price }}</div>
                    </template>

                    <!-- 步进器 -->
                    <template #num>
                        <van-stepper
                            v-model="cart.nums"
                            :name="cart.id"
                            disabled-input
                            @change="CartStep"
                        />
                    </template>
                </van-card>

                <!-- 删除按钮 -->
                <template #right>
                    <van-button
                        square
                        text="删除"
                        type="danger"
                        class="delete-button"
                        @click="CartDel(cart.id)"
                    />
                </template>
            </van-swipe-cell>
        </div>
    </van-checkbox-group>

    <!-- 提交订单栏 -->
    <van-submit-bar
        :price="price"
        button-text="提交订单"
        @submit="submit"
        style="bottom: 50px"
    >
        <van-checkbox v-model="toggle" @change="ToggleCheck">
            全选
        </van-checkbox>
    </van-submit-bar>

    <!-- 底部 -->
    <menus />
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));

let cartlist = ref([]);
let checked = ref([]);
let toggle = ref(false);

let price = computed(() => {
    var total = 0;

    cartlist.value.map((item) => {
        // 购物车id 是否在选中的数组中
        if (checked.value.includes(item.id)) {
            // 合算
            total += parseFloat(item.total);
        }
    });

    return parseFloat(total * 100);
});

// 钩子函数
onBeforeMount(() => {
    // 请求列表
    CartData();
});

const back = () => {
    proxy.$router.back(-1);
    return false;
};

// 接口请求
let CartData = async () => {
    var result = await proxy.$POST({
        url: "/cart/index",
        params: { busid: business.id },
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        cartlist.value = [];
        return false;
    }

    cartlist.value = result.data;
};

// 步进器修改数量
let CartStep = async (value, detail) => {
    // 组装数据
    var data = {
        busid: business.id,
        cartid: detail.name,
        nums: value,
    };

    var result = await proxy.$POST({
        url: "/cart/edit",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    }

    // 渲染商品数据
    CartData();
};

// 购物车删除
const CartDel = async (cartid) => {
    proxy
        .$confirm({
            title: "删除提醒",
            message: "是否确认删除",
        })
        .then(async () => {
            // 组装数据
            var data = {
                busid: business.id,
                cartid: cartid,
            };

            var result = await proxy.$POST({
                url: "/cart/del",
                params: data,
            });

            if (result.code == 0) {
                proxy.$fail(result.msg);
                return false;
            }

            // 渲染商品数据
            CartData();
        })
        .catch((err) => {
            console.log(err);
        });
};

// 复选框修改 单个切换
let CheckList = async (value) => {
    var ids = [];

    cartlist.value.map((item) => {
        ids.push(item.id);
    });

    if (value.sort().toString() == ids.sort().toString()) {
        toggle.value = true;
    } else {
        toggle.value = false;
    }
};

// 全选反选
let ToggleCheck = async () => {
    if (toggle.value) {
        cartlist.value.map((item) => {
            checked.value.push(item.id);
        });
    } else {
        checked.value = [];
    }
};

// 提交订单 -> 结算界面
let submit = async () => {
    if (checked.value.length <= 0) {
        proxy.$fail("请选择下单商品");
        return false;
    }

    var ids = checked.value.join(",");
    proxy.$router.push({ path: "/cart/confirm", query: { ids: ids } });
};
</script>

<style>
.cart {
    display: flex;
    width: 100%;
    background: var(--van-card-background);
}

.cart .van-checkbox {
    width: 2em;
    display: flex;
    justify-content: right;
    text-align: center;
}

.van-swipe-cell {
    width: 100%;
}

.delete-button {
    height: 100% !important;
}
</style>
