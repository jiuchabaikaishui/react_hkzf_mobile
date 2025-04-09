import { createContext } from "react";

// localStorage 中存储 token 的键
const token_key = 'hkzf_token'

// 获取 token
const getToken = () => localStorage.getItem(token_key)

// 设置 token
const setToken = (token) => localStorage.setItem(token_key, token)

// 删除 token
const removeToken = () => localStorage.removeItem(token_key)

// 判断是否登录
const isAuth = () => !!getToken()

// 是否登录 Context
const isLoginContext = createContext(isAuth())

// 设置是否登录 Context
const setIsLoginContext = createContext(null)

export { getToken, setToken, removeToken, isAuth, isLoginContext, setIsLoginContext }