import styles from "./Login.module.css";
import NavHeader from "../components/NavHeader";
import { Button, Toast } from "antd-mobile";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
import { instance } from "../utils/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { isAuth, isLoginContext, setIsLoginContext, setToken } from "../utils/auth";



export default function Login() {
    const navigate = useNavigate()
    const {state} = useLocation()
    const setIsLogin = useContext(setIsLoginContext)
    console.log('Login state: ', state);
    
    return (<div className={styles.root}>
        <NavHeader className={styles.header}>账号登录</NavHeader>
        <Formik 
        initialValues={{'username': '', password: ''}}
        onSubmit={(values) => {
            console.log('login values: ', values);
            
            // 请求登录接口
            instance.post('/user/login', {'username': values.username, 'password': values.password}).then((data) => {
                console.log('login data: ', data);
                const {description, body} = data
                if (data.status === 200) {
                    // 登录成功
                    setToken(body.token)
                    setIsLogin(isAuth())
                    if (state && state.from) {
                        navigate(state.from.pathname, {replace: true})
                    } else {
                        navigate(-1)
                    }
                } else {
                    // 登录失败
                    Toast.show({content: description})
                }
            })
        }}
        validationSchema={Yup.object().shape({
            username: Yup.string().required('账号为必填项').matches(/^\w{5,8}/, '5~8位的数字、字母、下划线'),
            password: Yup.string().required('密码为必填项').matches(/^\w{5,12}/, '5~8位的数字、字母、下划线')
        })}>
            {({values, handleSubmit, handleChange, errors, touched}) => {
                return <Form className={styles.form}>
                    <Field name="username" placeholder="请输入账号" className={styles.account}></Field>
                    <ErrorMessage name="username" className={styles.error} component='div'></ErrorMessage>
                    <Field name="password" type="password" placeholder="请输入密码" className={styles.password}></Field>
                    <ErrorMessage name="password" className={styles.error} component='div'></ErrorMessage>
                    <Button color='success' className={styles.login} type="submit">登 录</Button>
                </Form>
            }}
        </Formik>
        <Link className={styles.backHome} to='/registe'>还没有账号，去注册~</Link>
        <Link className={styles.backHome} to='/formik'>formik学习</Link>
    </div>)
}