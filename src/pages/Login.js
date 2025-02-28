import styles from "./Login.module.css";
import NavHeader from "../components/NavHeader";
import { Input, Button, Toast } from "antd-mobile";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { instance } from "../utils/api";



export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    return (<div className={styles.root}>
        <NavHeader className={styles.header}>账号登录</NavHeader>
        <form className={styles.form} onSubmit={(e) => {
            // 阻止默认行为
            e.preventDefault()

            // 请求登录接口
            instance.post('/user/login', {username, password}).then((data) => {
                console.log('login data: ', data);
                // 阻止默认行为
                e.preventDefault()
                const {status, description, body} = data
                if (status !== 200) {
                    // 登录成功
                    localStorage.setItem('hkzf_token', body.token)
                    navigate(-1)
                } else {
                    // 登录失败
                    Toast.show({content: description})
                }
            })
        }}>
            <Input placeholder="请输入账号" className={styles.account} clearable onChange={(v) => setUsername(v)}>{username}</Input>
            <Input type="password" placeholder="请输入密码" className={styles.password} clearable onChange={(v) => setPassword(v)}>{password}</Input>
            <Button color='success' className={styles.login} type="submit">登 录</Button>
        </form>
        <Link className={styles.backHome} to='/registe'>还没有账号，去注册~</Link>
        <Link className={styles.backHome} to='/formik'>formik学习</Link>
    </div>)
}