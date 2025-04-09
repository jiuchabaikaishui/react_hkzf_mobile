
import styles from "./HouseDetail.module.css";
import NavHeader from "../components/NavHeader";
import { useParams, useNavigate } from "react-router-dom";
import useData from "../utils/useData";
import { baseUrl } from "../utils/constValue";
import { Swiper, Modal, Toast } from "antd-mobile";
import { useEffect, useState } from "react";
import HouseItem from "../components/HouseItem";
import { instance } from "../utils/api";
import { isAuth } from "../utils/auth";
import HousePackage from "../components/HousePackage";

// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL

  // 猜你喜欢
  const recommendHouses = [
    {
      id: 1,
      houseImg: '/img/message/1.png',
      desc: '72.32㎡/南 北/低楼层',
      title: '安贞西里 3室1厅',
      price: 4500,
      tags: ['随时看房']
    },
    {
      id: 2,
      houseImg: '/img/message/2.png',
      desc: '83㎡/南/高楼层',
      title: '天居园 2室1厅',
      price: 7200,
      tags: ['近地铁']
    },
    {
      id: 3,
      houseImg: '/img/message/3.png',
      desc: '52㎡/西南/低楼层',
      title: '角门甲4号院 1室1厅',
      price: 4300,
      tags: ['集中供暖']
    }
  ]

export default function HouseDetail() {
    // 获取路由参数
    const routerParams = useParams()
    console.log('routerParams: ', routerParams);

    // 请求数据
    const { data } = useData.get('/houses/' + routerParams.id)
    // const { data } = {data:null}
    console.log('data: ', data);
    
    // 结构数据数据
    const {
        community,
        title,
        price,
        roomType,
        size,
        floor,
        oriented,
        supporting,
        description,
        houseImg,
        tags,
        coord
    } = data ? data.body : {}

    const {latitude, longitude} = coord ? coord : {}
    useEffect(() => {
        let ignore = false
        if (!ignore && latitude && longitude) {
            console.log('------------');
            
            // 创建地图实例  
            var map = new BMapGL.Map(styles.mapContainer);          
            //开启鼠标滚轮缩放             
            map.enableScrollWheelZoom(true);     
            // 设置中心点坐标和地图级别
            const point = new BMapGL.Point(longitude, latitude)
            map.centerAndZoom(point, 17);
            // 创建文本标注
            var label = new BMapGL.Label('', {       
                position: point, // 设置标注的地理位置
                offset: new BMapGL.Size(0, -36) // 设置标注的偏移量
            })  
            map.addOverlay(label); // 将标注添加到地图中
            // 设置label的样式
            label.setStyle({
                position: 'absolute',
                zIndex: -7982820,
                backgroundColor: 'rgb(238, 93, 91)',
                color: 'rgb(255, 255, 255)',
                height: 25,
                padding: '5px 10px',
                lineHeight: '14px',
                borderRadius: 3,
                boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
                whiteSpace: 'nowrap',
                fontSize: 12,
                userSelect: 'none'
            })
            label.setContent(`
                <span>${community}</span>
                <div class=${styles.mapArrow}></div>
            `)
        }

        return () => ignore = true
    }, [latitude, longitude, community])

    // 收藏
    const [isFavorite, setIsFavorite] = useState(false)
    useEffect(() => {
        let ignore = false
        // 登录才获取收藏数据
        if (isAuth()) {
            instance.get('/user/favorites/' + routerParams.id).then((data) => {
                if (!ignore) {
                    console.log('favorite data: ', data);
                    if (data.status === 200) {
                        setIsFavorite(data.body.isFavorite)
                    }
                }
            })
        }
        return () => ignore = true
    }, [])

    const navigate = useNavigate()
    
    return (<div className={styles.root}>
        {/* 导航栏 */}
        { community && <NavHeader className={styles.navHeader} rightContent={[<i className="iconfont icon-share" key='share'/>]}>{community}</NavHeader> }

        {/* 内容 */}
        <div className={styles.content}>
            {/* 轮播图 */}
            { houseImg && <div className={styles.swiper}>
                <Swiper
                loop
                autoplay
                style={{
                    '--height': '240px',
                }}
                >
                    {houseImg.map((item) => (
                        <Swiper.Item key={item}>
                            <a href="https://www.baidu.com/">
                                <img src={baseUrl + item} style={{width: '100%'}} alt=''></img>
                            </a>
                        </Swiper.Item>
                    ))}
                </Swiper>
            </div> }

            {/* 标题、标签 */}
            { title && <p className={styles.title}>{title}</p>}
            { tags && <div className={styles.tagsBox}>
                { tags.map((tag, i) => {
                    const tagClass = 'tag' + (1 + i%3)
                    return <span className={styles.tags + ' ' + styles[tagClass]} key={tag}>{tag}</span>
                }) }
            </div> }

            {/* 价格、房型、面积 */}
            <div className={styles.infoPrice}>
                { price && <div className={styles.infoPriceItem}>
                    <div>{price}
                        <span className={styles.month}>/月</span>
                    </div>
                    <div className={styles.infoPriceKey}>租金</div>
                </div> }
                { roomType && <div className={styles.infoPriceItem}>
                    <div>{roomType}</div>
                    <div className={styles.infoPriceKey}>房型</div>
                </div> }
                { size && <div className={styles.infoPriceItem}>
                    <div>{size}平米</div>
                    <div className={styles.infoPriceKey}>面积</div>
                </div> }
            </div>

            {/* 装修、楼层、朝向等 */}
            <div className={styles.infoBasic}>
                <div className={styles.infoBasicItem}>
                    <div className={styles.infoBasicKey}>装修：</div>
                    <div className={styles.infoBasicValue}>精装</div>
                </div>
                { floor && <div className={styles.infoBasicItem}>
                    <div className={styles.infoBasicKey}>楼层：</div>
                    <div className={styles.infoBasicValue}>{floor}</div>
                </div> }
                { oriented && <div className={styles.infoBasicItem}>
                    <div className={styles.infoBasicKey}>朝向：</div>
                    <div className={styles.infoBasicValue}>{oriented.join('、')}</div>
                </div> }
                <div className={styles.infoBasicItem}>
                    <div className={styles.infoBasicKey}>类型：</div>
                    <div className={styles.infoBasicValue}>普通住宅</div>
                </div>
            </div>

            {/* 地图 */}
            <div className={styles.map}>
                { community && <div className={styles.mapTitle}>小区：<span>{community}</span></div> }
                <div id={styles.mapContainer}></div>
            </div>

            {/* 房屋配套 */}
            <div className={styles.about}>
                <div>房屋配套</div>
                {data && <HousePackage supporting={supporting}></HousePackage>}
            </div>

            {/* 房源概况 */}
            <div className={styles.set}>
                <div className={styles.houseTitle}>房源概况</div>
                <div className={styles.user}>
                    <div className={styles.avatar}>
                        <img src={baseUrl + '/img/avatar.png'} alt="头像"></img>
                    </div>
                    <div className={styles.userInfo}>
                        <div>王女士</div>
                        <div className={styles.userAuth}>
                            <i className="iconfont icon-auth" />
                            已认证房主
                        </div>
                    </div>
                    <div className={styles.userMsg}>发消息</div>
                </div>
                <div className={styles.descText}>
                    {description || '暂无房屋描述'}
                </div>
            </div>

            {/* 推荐 */}
            <div className={styles.recommend}>
                <div className={styles.houseTitle}>猜你喜欢</div>
                {
                    recommendHouses.map((item) => {
                        return <HouseItem key={item.id} item={item}></HouseItem>
                    })
                }
            </div>

            {/* 底部栏工具栏 */}
            <div className={styles.footer}>
                <div className={styles.favorite} onClick={async () => {
                    if (isAuth()) {
                        // 已登录
                        if (isFavorite) {
                            // 已收藏
                            const deleteData = await instance.delete('/user/favorites/' + routerParams.id)
                            console.log('delete data: ', deleteData);
                            if (deleteData.status === 200) {
                                Toast.show('已取消收藏')
                                setIsFavorite(false)
                            } else {
                                Toast.show('登录超时，请重新登录')
                            }
                        } else {
                            // 未收藏
                            const postData = await instance.post('/user/favorites/' + routerParams.id)
                            console.log('post data: ', postData);
                            if (postData.status === 200) {
                                Toast.show('已收藏')
                                setIsFavorite(true)
                            } else {
                                Toast.show('登录超时，请重新登录')
                            }
                        }
                    } else {
                        // 未登录
                        Modal.show({
                            title: '提示',
                            content: '登录后才能收藏房源，是否去登录?',
                            closeOnAction: true,
                            actions: [
                                {
                                    key: 'cancel',
                                    text: '取消'
                                },
                                {
                                    key: 'confirm',
                                    text: '去登录',
                                    primary: true,
                                    onClick: async () => navigate('/login', {state: {from: 'location'}})
                                }
                            ]
                        })
                    }
                }}>
                    <img
                    src={
                        baseUrl + (isFavorite ? '/img/star.png' : '/img/unstar.png')
                    }
                    className={styles.favoriteImg}
                    alt="收藏"
                    />
                    <span className={styles.favoriteTxt}>
                    {isFavorite ? '已收藏' : '收藏'}
                    </span>
                </div>
                <div className={styles.consult}>
                    在线咨询
                </div>
                <div className={styles.telephone}>
                    <a href="tel:400-618-4000" className={styles.telephoneTxt}>
                        电话预约
                    </a>
                </div>
            </div>
        </div>
    </div>)
}