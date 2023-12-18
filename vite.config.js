import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

//引入读取路径的一个nodejs模块
import path from "path";

// 引入自动导入组件插件
import Components from "unplugin-vue-components/vite";

// 自动导入vue，项目插件库
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
    //别名配置
    resolve: {
        alias: {
            //设置路径的别名
            // __dirname 当前所在的目录 /shop
            // path.resolve 拼接路径 /shop/src
            "@": path.resolve(__dirname, "src"),
            vue: "vue/dist/vue.esm-bundler.js", // 定义vue的别名，如果使用其他的插件，可能会用到别名
        },
    },
    server: {
        port: 5000,
        proxy: {
            //服务的请求代理
            "/shop": {
                target: "https://fastadmin.yunjian0128.cn/shop/",
                // target: "http://www.fastadmin.com/shop/",
                changeOrigin: true, // 跨域

                // 替换掉shop前缀 防止多个shop地址
                rewrite: (path) => path.replace(/^\/shop/, ""),
            },
        },
    },
    plugins: [
        vue(),
        // 设置自动加载规则
        Components({
            // 指定组件位置，默认是src/components
            dirs: ["src/components"],
            extensions: ["vue"],
        }),
        //自动导入库
        AutoImport({
            imports: ["vue", "vue-router"],
        }),
    ],
});
