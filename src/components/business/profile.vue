<template>
    <van-nav-bar
        title="基本资料"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-form @submit="profile">
        <van-cell-group inset>
            <!-- 头像组件 -->
            <van-row justify="center" :style="{ margin: '30px auto' }">
                <van-col>
                    <van-field name="avatar" :style="{ textAlign: 'center' }">
                        <template #input>
                            <van-uploader v-model="avatar" max-count="1" />
                        </template>
                    </van-field>
                </van-col>
            </van-row>

            <van-field
                v-model="business.mobile"
                name="mobile"
                label="手机号"
                placeholder="手机号"
                :rules="rules.mobile"
            />

            <van-field
                v-model="business.nickname"
                name="nickname"
                label="昵称"
                placeholder="昵称"
                :rules="rules.nickname"
            />

            <van-field
                type="password"
                v-model="business.password"
                name="password"
                label="密码"
                placeholder="密码"
            />

            <van-field
                v-model="business.email"
                name="email"
                label="邮箱"
                placeholder="邮箱"
                :rules="rules.email"
            />

            <van-field name="gender" label="性别">
                <template #input>
                    <van-radio-group
                        v-model="business.gender"
                        direction="horizontal"
                    >
                        <van-radio name="0">保密</van-radio>
                        <van-radio name="1">男</van-radio>
                        <van-radio name="2">女</van-radio>
                    </van-radio-group>
                </template>
            </van-field>

            <!-- 城市数据 -->
            <van-field
                v-model="business.region_text"
                is-link
                readonly
                name="region"
                label="所在地区"
                placeholder="所在地区"
                @click="ShowRegion = true"
            />

            <!-- 弹出层 -->
            <van-popup v-model:show="ShowRegion" position="bottom">
                <!-- 地区组件 -->
                <van-area
                    v-model="RegionCode"
                    :area-list="areaList"
                    @confirm="RegionConfirm"
                    @cancel="ShowRegion = false"
                />
            </van-popup>

            <van-button
                round
                block
                type="primary"
                native-type="submit"
                :style="{ marginTop: '40px' }"
            >
                提交
            </van-button>
        </van-cell-group>
    </van-form>
</template>

<script setup>
import { areaList } from "@vant/area-data";

// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取cookie 创建响应式
var business = reactive(proxy.$cookies.get("business"));

// 设置表单的验证规则
let rules = {
    mobile: [
        { required: true, message: "请填写手机号" },
        { pattern: /^1[3456789]\d{9}$/, message: "手机号码格式有误" },
    ],
    nickname: [{ required: true, message: "请填写昵称" }],
    email: [
        { required: true, message: "请填写邮箱" },
        {
            pattern: /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/,
            message: "邮箱格式有误",
        },
    ],
};

// 地区数据
let ShowRegion = ref(false);
let RegionCode = ref(business.district || business.city || business.province);

// 头像数据
const avatar = ref([
    {
        url: business.avatar_text,
    },
]);

const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 地区选择
const RegionConfirm = ({ selectedOptions }) => {
    // 隐藏弹出层
    ShowRegion.value = false;
    business.region_text = selectedOptions.map((item) => item.text).join("-");
    var arr = selectedOptions.map((item) => item.value);
    RegionCode.value = arr[2] || arr[1] || arr[0];
};

// 表单提交
const profile = async (values) => {
    // 组装数据
    var data = {
        id: business.id,
        mobile: values.mobile,
        nickname: values.nickname,
        gender: values.gender,
        email: values.email,
        code: RegionCode.value,
    };

    // 密码
    if (values.password) {
        data.password = values.password;
    }

    // 头像
    if (values.avatar[0] == undefined) {
        // 发起POST请求
        var result = await proxy.$POST({
            url: "/business/profile",
            params: data,
        });

        if (result.code == 0) {
            proxy.$fail(result.msg);
            return false;
        } else {
            proxy.$success(result.msg);
            proxy.$router.go(-1);
        }
    } else {
        // 头像
        data.avatar = values.avatar[0].file;

        // 发起UPLOAD请求
        var result = await proxy.$UPLOAD({
            url: "/business/profile",
            params: data,
        });

        if (result.code == 0) {
            proxy.$fail(result.msg);
            return false;
        } else {
            proxy.$success(result.msg);
            proxy.$router.go(-1);
        }
    }
};
</script>

<style>
:root {
    --van-uploader-size: 150px;
}
</style>
