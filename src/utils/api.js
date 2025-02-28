import axios from "axios";
import { baseUrl, timeOut } from "./constValue";
import { Toast } from "antd-mobile";

// 创建配置对象
const config = {
    baseURL: baseUrl,
    timeout: timeOut
}

// 根据create 方法来构建axios对象
export const instance = axios.create(config)

// 请求拦截器
instance.interceptors.request.use((config) => {
    console.log('url: ', config.baseURL + config.url);
    console.log('params: ', config.params);
    console.log('params data: ', config.data);
    Toast.show({icon: 'loading', duration: 0, content: '加载中…', maskClickable: false})
    return config
})
// 响应拦截器
instance.interceptors.response.use((res) => {
    console.log('data: ', res);
    Toast.clear()
    return res.data
}, (error) => {
    console.log('error: ', error);
    Toast.clear()
    return Promise.reject(error)
})
