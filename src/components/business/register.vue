<template>
  <link href="/assets/css/reset.css" rel="stylesheet" />
  <link rel="stylesheet" type="text/css" href="/assets/css/login.css" />
  <div class="limiter">
    <div class="container-login100">
        <div class="wrap-login100">
            <van-form @submit="register" class="login100-form validate-form">
                    <div class="login100-form-avatar">
                        <img src="/assets/images/pexels-spencer-selover-428364.jpg" />
                    </div>

                    <div class="wrap-input100 validate-input">
                        <van-field
                            v-model="business.mobile"
                            name="mobile"
                            label="手机号"
                            placeholder="手机号"
                            :rules="rules.mobile"
                        />
                    </div>

                    <div class="wrap-input100 validate-input">
                        <van-field
                            v-model="business.password"
                            type="password"
                            name="password"
                            label="密码"
                            placeholder="密码"
                            :rules="rules.password"
                        />
                    </div>
    
                    <div class="container-login100-form-btn">
                        <van-button class="login100-form-btn" round block native-type="submit">注 册</van-button>
                    </div>
    
                    <div class="action">
                        <router-link to="/business/login" class="txt1">立即登录 》</router-link>
                    </div>
            </van-form>
        </div>
    </div>
  </div>
</template>

<script setup>
    //相当于vue2 选项式API当中的 this对象
    import {getCurrentInstance} from 'vue'
    const {proxy} = getCurrentInstance()

    //获取cookie
    var cookie = proxy.$cookies.get('business') ? proxy.$cookies.get('business') : {}

    if(Object.getOwnPropertyNames(cookie).length > 0)
    {
        proxy.$router.push('/business/index')
    }

    
    
    
    //初始化的数据
    let business = reactive({
        mobile: '13060808099',
        password: ''
    })

    //初始化的效验规则
    let rules = {
        mobile: [
            {required: true, message: '请填写手机号'},
            {pattern:/^1[3456789]\d{9}$/, message: '手机号码格式有误'}
        ],
        password:[
            {required: true, message: '请填写密码'},
        ]
    }

    //表单提交方法
    const register = async (values) =>
    {
        //组装数据
        var data = {
            mobile: values.mobile,
            password: values.password
        }

        //发送接口请求
        // www.fast.com/shop/business/register
        var result = await proxy.$POST({
            url: '/business/register',
            params: data
        })

        if(result.code == 0)
        {
            proxy.$fail(result.msg)
            return false
        }

        proxy.$success({
            message: result.msg,
            duration: 1000,
            onClose: () => proxy.$router.push(result.url)
        })
    }
</script>