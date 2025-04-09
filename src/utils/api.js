import axios from "axios";
import { baseUrl, timeOut } from "./constValue";
import { Toast } from "antd-mobile";
import { getToken, isAuth, removeToken, setIsLoginContext } from "./auth";
import { useContext } from "react";

// 创建配置对象
const config = {
    baseURL: baseUrl,
    timeout: timeOut
}

// 根据create 方法来构建axios对象
export const instance = axios.create(config)

// 请求拦截器
instance.interceptors.request.use((config) => {
    // 统一打印接口请求参数日志
    console.log('request url: ', config.baseURL + config.url);
    console.log('request params: ', config.params);
    console.log('request headers: ', config.headers);
    console.log('request data: ', config.data);

    // 统一显示加载提示
    Toast.show({icon: 'loading', duration: 0, content: '加载中…', maskClickable: false})

    // 统一判断请求url路径添加请求头
    const {url} = config
    if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) {
        config.headers.Authorization = getToken()
    }

    return config
})

// 响应拦截器
instance.interceptors.response.use((res) => {
    // 统一打印接口响应数据日志
    console.log('response data: ', res);

    // 清除加载提示
    Toast.clear()

    // 统一判断 token 是否失效或者被清除
    const {status} = res.data
    if (status === 400 || res.data.status === 400) {
        if (isAuth) {
            removeToken()
        }
        if (instance.setIsLogin) {
            instance.setIsLogin(isAuth())
        }
    }

    return res.data
}, (error) => {
    // 统一打印接口响应错误日志
    console.log('response error: ', error);

    // 清除加载提示
    Toast.clear()

    // 添加网络请求失败提示
    Toast.show('网络开小差，请稍后再试…')

    return Promise.reject(error)
})