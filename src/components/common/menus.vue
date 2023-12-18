<template>
    <!-- 底部 -->
    <van-tabbar route style="max-width: 512px">
        <van-tabbar-item replace to="/" icon="wap-home-o"></van-tabbar-item>
        <van-tabbar-item
            replace
            to="/product/list"
            icon="shop-o"
        ></van-tabbar-item>
        <van-tabbar-item
            replace
            to="/cart/index"
            icon="cart-o"
        ></van-tabbar-item>
        <van-tabbar-item
            replace
            to="/business/index"
            icon="manager-o"
        ></van-tabbar-item>
    </van-tabbar>
</template>

<style>
.van-nav-bar {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
}
</style>
