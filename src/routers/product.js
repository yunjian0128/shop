// 引入组件
import ProductList from "@/components/product/list.vue";
import ProductInfo from "@/components/product/info.vue";

// 子路由列表
const children = [
    // 子路由
    {
        name: "ProductList",
        path: "list",
        component: ProductList,
    },
    {
        name: "ProductInfo",
        path: "info",
        component: ProductInfo,
    },
];

// 1级路由的组件
const layout = {
    template: `<router-view></router-view>`,
};

// 组装一个客户的路由
export default {
    name: "product",
    path: "/product", // 1级路由
    component: layout, // 组件
    children: children,
};
