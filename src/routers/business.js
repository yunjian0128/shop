// 引入组件
import register from "@/components/business/register.vue";
import login from "@/components/business/login.vue";
import BusinessIndex from "@/components/business/index.vue";
import BusinessProfile from "@/components/business/profile.vue";
import BusinessEmail from "@/components/business/email.vue";
import BusinessRecord from "@/components/business/record.vue";
import BusinessPay from "@/components/business/pay.vue";
import BusinessConfirm from "@/components/business/confirm.vue";
import BusinessPayrecord from "@/components/business/payrecord.vue";

// 子路由列表
const children = [
    // 子路由
    {
        name: "register",
        path: "register",
        component: register,
    },
    {
        name: "login",
        path: "login",
        component: login,
    },
    {
        name: "BusinessIndex",
        path: "index",
        component: BusinessIndex,
        meta: { auth: true },
    },
    {
        name: "BusinessProfile",
        path: "profile",
        component: BusinessProfile,
        meta: { auth: true },
    },
    {
        name: "BusinessEmail",
        path: "email",
        component: BusinessEmail,
        meta: { auth: true },
    },
    {
        name: "BusinessRecord",
        path: "record",
        component: BusinessRecord,
        meta: { auth: true },
    },
    {
        name: "BusinessPay",
        path: "pay",
        component: BusinessPay,
        meta: { auth: true },
    },
    {
        name: "BusinessConfirm",
        path: "confirm",
        component: BusinessConfirm,
        meta: { auth: true },
    },
    {
        name: "BusinessPayrecord",
        path: "payrecord",
        component: BusinessPayrecord,
        meta: { auth: true },
    },
];

//1级路由的组件
const layout = {
    template: `<router-view></router-view>`,
};

// 组装一个客户的路由
export default {
    name: "business",
    path: "/business", //1级路由
    component: layout, //组件
    children: children,
};
