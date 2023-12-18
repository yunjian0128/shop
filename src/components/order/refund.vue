<template>
    <van-nav-bar
        title="退款退货"
        left-text="返回"
        left-arrow
        @click-left="back"
    />
    <van-form @submit="refund">
        <van-cell-group inset>
            <!-- 退款退货原因-->
            <van-field
                name="reasontext"
                @click="showReason = true"
                readonly
                v-model="reasontext"
                label="退货退款原因"
                type="input"
                placeholder="请选择退款原因"
                :rules="rule.reasontext"
            />

            <!-- 退款退货说明 -->
            <van-field
                name="remark"
                v-model="remark"
                label="退款退货说明"
                type="textarea"
                rows="6"
                placeholder="请输入退款退货说明"
                v-if="reason == 7"
                :rules="rule.remark"
            />

            <!-- 退款退货说明 -->
            <van-field
                name="remark"
                v-model="remark"
                label="退款退货说明"
                type="textarea"
                rows="6"
                placeholder="请输入退款退货说明"
                v-else
            />

            <!-- 退款退货凭证 -->
            <van-row justify="center">
                <van-col>
                    <van-field
                        name="thumbs"
                        :rules="rule.thumbs"
                        v-if="reason == 6"
                    >
                        <template #input>
                            <van-uploader
                                multiple
                                upload-text="上传退款退货凭证"
                                v-model="thumbs"
                                max-count="1"
                            >
                                <template #preview-cover="{ file }">
                                    <div class="preview-cover van-ellipsis">
                                        {{ file.name }}
                                    </div>
                                </template>
                            </van-uploader>
                        </template>
                    </van-field>
                    <van-field name="thumbs" v-else>
                        <template #input>
                            <van-uploader
                                multiple
                                upload-text="上传退款退货凭证"
                                v-model="thumbs"
                                max-count="1"
                            >
                                <template #preview-cover="{ file }">
                                    <div class="preview-cover van-ellipsis">
                                        {{ file.name }}
                                    </div>
                                </template>
                            </van-uploader>
                        </template>
                    </van-field>
                </van-col>
            </van-row>

            <!-- 提交按钮 -->
            <van-button
                round
                block
                type="primary"
                native-type="submit"
                style="width: 85%; margin: 40px auto"
            >
                提交
            </van-button>
        </van-cell-group>
    </van-form>

    <!-- 退款退货原因弹出层 -->
    <van-popup v-model:show="showReason" position="bottom" :round="true">
        <van-picker
            show-toolbar
            title="退款退货原因"
            :columns="columns"
            @confirm="onConfirm"
            @cancel="onCancel"
        />
    </van-popup>
</template>

<script setup>
// 相当于vue2 选项式API当中的 this对象
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

// 获取到用户的信息
var business = reactive(proxy.$cookies.get("business"));
var orderid = proxy.$route.query.orderid ? proxy.$route.query.orderid : 0;
orderid = ref(orderid);
var reasontext = ref("");
var reason = ref("");
var remark = ref("");
var thumbs = ref([]);
var showReason = ref(false);
var columns = ref([
    { text: "错拍", value: "1" },
    { text: "漏拍", value: "2" },
    { text: "未按约定时间发货", value: "3" },
    { text: "快递/物流一直未送达", value: "4" },
    { text: "虚假发货", value: "5" },
    { text: "货物损坏", value: "6" },
    { text: "其他", value: "7" },
]);

// 设置表单的验证规则
let rule = {
    reasontext: [{ required: true, message: "请填写退货原因" }],

    // 当选择其他时，需要填写退货说明
    remark: [{ required: true, message: "请填写退货说明" }],

    // 当选择货物损坏时，需要上传退货凭证
    thumbs: [{ required: true, message: "请上传退货凭证" }],
};

// 返回
const back = () => {
    proxy.$router.go(-1);
    return false;
};

// 退款退货原因
const onConfirm = (value) => {
    showReason.value = false;
    reasontext.value = value.selectedOptions[0].text;
    reason.value = value.selectedOptions[0].value;
};
const onCancel = () => {
    showReason.value = false;
};

// 表单提交
const refund = async (values) => {
    // 组装数据
    var data = {
        orderid: orderid.value,
        busid: business.id,
        reason: values.reasontext,
        remark: values.remark,
    };

    if (values.thumbs[0] == undefined) {
        // 发起POST请求
        var result = await proxy.$POST({
            url: "/order/refund",
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
        // 上传评价图片
        data.thumbs = values.thumbs[0].file;

        // 发起请求
        var result = await proxy.$UPLOAD({
            url: "/order/refund",
            params: formData,
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
    --van-uploader-border-radius: 0 !important;
}

.preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
}
</style>
