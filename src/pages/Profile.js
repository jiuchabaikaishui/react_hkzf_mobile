import styles from "./Profile.module.css";
import { baseUrl } from "../utils/constValue";
import { useState, useEffect, useContext } from "react";
import { isAuth, removeToken, getToken, isLoginContext, setIsLoginContext } from "../utils/auth";
import { Grid, Modal, Toast } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { instance } from "../utils/api";

// 默认头像
const DEFAULT_AVATAR = baseUrl + '/img/profile/avatar.png'
// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity'},
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

export default function Profile() {
    // const [isLogin, setIsLogin] = useState(isAuth())
    const isLogin = useContext(isLoginContext)
    const setIsLogin = useContext(setIsLoginContext)
    const [userInfo, setUserInfo] = useState({
        avatar: '',
        nickname: ''
    })
    const {avatar, nickname} = userInfo
    useEffect(() =>  {
        let ignore = false
        if (isLogin) {
            instance.get('/user', {headers: {authorization: getToken()}}).then((data) => {
                if (!ignore) {
                    if (data.status === 200) {
                        setUserInfo(data.body)
                    }
                }
            })
        }
        return () => ignore = true
    }, [isLogin])
    const navigate = useNavigate()
    return (<div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
            <img className={styles.bg} src={baseUrl + '/img/profile/bg.png'} alt=""></img>
            <div className={styles.info}>
                <div className={styles.myIcon}>
                    <img className={styles.avater} src={avatar || DEFAULT_AVATAR} alt="头像"></img>
                </div>
                <div className={styles.user}>
                    <div className={styles.name}>{nickname || '游客'}</div>
                    <span className={isLogin ? styles.logout : styles.login} onClick={() => {
                        if (isLogin) {
                            Modal.show({
                                title: '提示',
                                content: '是否确定退出?',
                                closeOnAction: true,
                                actions: [
                                    {
                                        key: 'cancel',
                                        text: '取消'
                                    },
                                    {
                                        key: 'confirm',
                                        text: '退出',
                                        primary: true,
                                        onClick: async () => {
                                            const data = await instance.post('/user/logout').finally((data) => {
                                                console.log('logout data: ', data);
                                                // 移除 token
                                                removeToken()
                                                setIsLogin(isAuth)

                                                // 清除用户信息
                                                setUserInfo({
                                                    avatar: '',
                                                    nickname: ''
                                                })
                                            })
                                        }
                                    }
                                ]
                            })
                        } else {
                            navigate('/login')
                        }
                    }}>{isLogin ? '退出' : '去登录'}</span>
                </div>
                <div className={styles.edit}>编辑个人资料<span className={styles.arrow}><i className="iconfont icon-arrow" /></span></div>
            </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid columns={3} gap={8} className={styles.grid}>
            {menus.map((item) => {
                console.log('item: ', item);
                return <Grid.Item key={item.id} onClick={() => {
                    if (item.to) navigate(item.to)
                }}>
                    <div className={styles.menusItem}>
                        <span className={'iconfont ' + item.iconfont}></span>
                        <span>{item.name}</span>
                    </div>
                </Grid.Item>
            })}
        </Grid>

        {/* 加入我们 */}
        <div className={styles.add}>
            <img src={baseUrl + '/img/profile/join.png'} alt=""></img>
        </div>
    </div>)
}