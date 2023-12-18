// 引入组件
import OrderIndex from "@/components/order/index.vue";
import OrderInfo from "@/components/order/info.vue";
import Express from "@/components/order/express.vue";
import Refund from "@/components/order/refund.vue";
import Confirm from "@/components/order/confirm.vue";
import Comment from "@/components/order/comment.vue";

//子路由列表
const children = [
    //子路由
    {
        name: "OrderIndex",
        path: "index",
        component: OrderIndex,
        meta: { auth: true },
    },
    {
        name: "OrderInfo",
        path: "info",
        component: OrderInfo,
        meta: { auth: true },
    },
    {
        name: "Express",
        path: "express",
        component: Express,
        meta: { auth: true },
    },
    {
        name: "Refund",
        path: "refund",
        component: Refund,
        meta: { auth: true },
    },
    {
        name: "Confirm",
        path: "confirm",
        component: Confirm,
        meta: { auth: true },
    },
    {
        name: "Comment",
        path: "comment",
        component: Comment,
        meta: { auth: true },
    },
];

//1级路由的组件
const layout = {
    template: `<router-view></router-view>`,
};

// 组装一个客户的路由
export default {
    name: "order",
    path: "/order", //1级路由
    component: layout, //组件
    children: children,
};
