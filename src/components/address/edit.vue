<template>
    <van-nav-bar
        title="编辑收货地址"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-address-edit
        :address-info="info"
        :area-list="areaList"
        show-set-default
        show-delete
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save"
        @delete="del"
    />
</template>

<script setup>
import { areaList } from "@vant/area-data";

// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));

// 收货地址的默认信息
var info = ref({});

// 获取参数
let id = proxy.$route.query.id ? proxy.$route.query.id : 0;
id = ref(id);

onBeforeMount(() => {
    Address();
});

const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 查询地址
let Address = async () => {
    // 组装数据
    var data = {
        id: id.value,
        busid: business.id,
    };

    var result = await proxy.$POST({
        url: "/address/info",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        proxy.$router.go(-1);
        return false;
    }

    var data = result.data;

    var code = data.district || data.city || data.province;

    info.value = {
        name: data.consignee,
        tel: data.mobile,
        areaCode: code,
        addressDetail: data.address,
        isDefault: data.status == "1" ? true : false,
    };
};

// 编辑地址
let save = async (info) => {
    // 组装数据
    var data = {
        id: id.value,
        busid: business.id,
        consignee: info.name,
        code: info.areaCode,
        address: info.addressDetail,
        mobile: info.tel,
        status: info.isDefault ? "1" : "0",
    };

    var result = await proxy.$POST({
        url: "/address/edit",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    } else {
        proxy.$success(result.msg);
        proxy.$router.go(-1);
    }
};

let del = async (info) => {
    // 组装数据
    var data = {
        id: id.value,
        busid: business.id,
    };

    // 提醒
    proxy
        .$confirm({
            title: "删除提醒",
            message: "是否确认删除该收货地址",
        })
        .then(async () => {
            // 发请求
            var result = await proxy.$POST({
                url: "/address/del",
                params: data,
            });

            if (result.code == "0") {
                proxy.$fail(result.msg);
                return false;
            }

            proxy.$success(result.msg);
            proxy.$router.go(-1);
        })
        .catch(() => {});
};
</script>
