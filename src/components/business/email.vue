<template>
    <van-nav-bar
        title="邮箱认证"
        left-text="返回"
        left-arrow
        @click-left="back"
    />

    <van-form @submit="email">
        <van-cell-group inset>
            <!-- 头像组件 -->
            <van-row justify="center" :style="{ margin: '30px auto' }">
                <van-col>
                    <van-image
                        round
                        width="10rem"
                        height="10rem"
                        :src="business.avatar_text"
                    />
                </van-col>
            </van-row>

            <van-field
                v-model="business.email"
                label="邮箱"
                placeholder="邮箱"
                readonly
            />

            <van-field
                v-model="code"
                name="code"
                center
                clearable
                label="邮箱验证码"
                placeholder="请输入邮箱验证码"
                :rules="[{ required: true, message: '请输入邮箱验证码' }]"
            >
                <template #button>
                    <van-button
                        size="small"
                        type="primary"
                        @click="send"
                        :disabled="btn.disabled"
                        :loading="btn.loading"
                        :loading-text="loading - text"
                    >
                        {{ btn.msg }}
                    </van-button>
                </template>
            </van-field>

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
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取cookie 创建响应式
var business = reactive(proxy.$cookies.get("business"));
var code = ref("");
var btn = reactive({
    msg: "发送验证码",
    disabled: false,
    loading: false,
    text: "邮件正在发送中...",
});

const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 邮件发送
const send = async () => {
    btn.loading = true;
    btn.disabled = true;

    // 组装数据
    var data = {
        id: business.id,
        action: "send",
    };

    // 请求发送验证码
    var result = await proxy.$POST({
        url: "/business/email",
        params: data,
    });

    if (result.code == 0) {
        proxy.$fail(result.msg);
        return false;
    }

    proxy.$success(result.msg);

    var times = 60;
    btn.msg = "重新发送(" + times + ")";
    btn.loading = false;

    var autoplay = () => {
        if (btn.msg <= 0) {
            // 倒计时结束
            btn.msg = "重新发送验证码";
            btn.disabled = false;
            clearInterval(T);
        } else {
            times--;
            btn.msg = "重新发送(" + times + ")";
        }
    };

    // 设置定时器
    var T = setInterval(autoplay, 1000);
};

// 表单提交
const email = async (values) => {
    // 组装数据
    var data = {
        id: business.id,
        code: values.code,
    };

    // 发起请求
    var result = await proxy.$POST({
        url: "/business/email",
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
</script>
