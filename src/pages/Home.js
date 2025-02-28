import { Swiper, Toast, Grid } from 'antd-mobile'
import './Home.scss'
import useData from '../utils/useData'

// 导入所需图片
import nav1 from "../assets/images/nav-1.png";
import nav2 from "../assets/images/nav-2.png";
import nav3 from "../assets/images/nav-3.png";
import nav4 from "../assets/images/nav-4.png";

import { useNavigate } from "react-router-dom";
import '../assets/fonts/iconfont.css'
import useCurrentCity from "../utils/useCurrentCity";
import { baseUrl } from "../utils/constValue";

// 渲染轮播图
function renderSwiper(data, indexChange, indexClick) {
    return <div className='swiper'>
        {data && <Swiper
        loop
        autoplay
        onIndexChange={ indexChange }
        >
            {data.body.map((item, index) => (
                <Swiper.Item key={index}>
                    <div
                    className='content'
                    onClick={ (e) => indexClick(index, e) }
                    >
                        <img src={baseUrl + item.imgSrc} style={{width: '100%'}} alt=''></img>
                    </div>
                </Swiper.Item>
            ))}
        </Swiper>}
    </div>
}

// 构建导航菜单数据
const navData = [
    {
      id: 1,
      img: nav1,
      title: '整租',
      path: '/house'
    },
    {
      id: 2,
      img: nav2,
      title: '合租',
      path: '/home/list'
    },
    {
      id: 3,
      img: nav3,
      title: '地图找房',
      path: '/map'
    },
    {
      id: 4,
      img: nav4,
      title: '去出租',
      path: '/rent/add'
    }
  ]

// 渲染导航菜单
function renderNav(data, onClick) {
    return (<div className='home-nav'>
        {data.map((item) => {
            return <div className='home-nav-item' key={item.id} onClick={() => onClick(item)}>
                <img src={item.img} alt=''></img>
                <p>{item.title}</p>
            </div>
        })}
    </div>)
}

// 渲染租房小组
function renderGroup(data) {
    return <div className='group'>
        <div className='top'>
            <div className='name'>租房小组</div>
            <div className='more'>更多</div>
        </div>
        <Grid columns={2} gap={[32, 16]}>
            {data && data.body.map((item) => {
                return <Grid.Item key={item.id}>
                    <div className='item'>
                        <div className='left'>
                            <div className='title'>{item.title}</div>
                            <div className='desc'>{item.desc}</div>
                        </div>
                        <div className='right'>
                            <img className='picture' src={`${baseUrl}${item.imgSrc}`} alt=''></img>
                        </div>
                    </div>
                </Grid.Item>
            })}
        </Grid>
    </div>
}

// 渲染最新资讯
function renderNews(data) {
    return <div className='news'>
        <div className='name'>最新资讯</div>
        {data && data.body.map((item) => {
            return <div className='item' key={item.id}>
                <img className='picture' src={`${baseUrl}${item.imgSrc}`} alt=''></img>
                <div className='info'>
                    <div className='title'>{item.title}</div>
                    <div className='other'>
                        <div className='from'>{item.from}</div>
                        <div className='date'>{item.date}</div>
                    </div>
                </div>
            </div>
        })}
    </div>
}

// 渲染顶部搜索
function renderHeaderSearch(cityName, onClickLoction, onClickSearch, onClickMap) {
    return <div className='headerSearch'>
        <div className='search'>
            <div className='location' onClick={onClickLoction}>
                <span className="name">{cityName}</span>
                <i className="iconfont icon-arrow" />
            </div>
            <div className='form' onClick={onClickSearch}>
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
            </div>
        </div>
        <div className="iconfont icon-map" onClick={onClickMap}></div>
    </div>
}

export default function Home() {
    // 获取轮播图数据
    const { data: swiperData } = useData.get('home/swiper')
    console.log('swiperData: ', swiperData);

    const navigate = useNavigate()

    // 获取租房小组数据
    const { data: groupData } = useData.get('home/groups', { area: 'AREA%7C88cff55c-aaa4-e2e0' })
    console.log('groupData: ', groupData);
    
    // 获取最新资讯数据
    const { data: newsData } = useData.get('home/news', { area: 'AREA%7C88cff55c-aaa4-e2e0' })
    console.log('newsData: ', newsData);

    // 百度地图 IP 定位，转换城市数据
    const { currentCity: city } = useCurrentCity()
    /*
    const [ city, setCity ] = useState(null);
    useEffect(() => {
        var ignore = false
        requestCurrentCity().then((data) => {
            if (!ignore) {
                console.log('cityData：', data);
                setCity(data.label)
            }
        })

        // var ignore = false
        // var localCity = new window.BMapGL.LocalCity();
        // localCity.get((result) => {
        //     if (!ignore) {
        //         console.log('LocalCity：', result);
        //         axios.get('area/info?name=' + result.name).then((cityData) => {
        //             if (!ignore) {
        //                 console.log('cityData：', cityData);
        //                 setCity(cityData.body.label)
        //             }
        //         })
        //     }
        // }); 
        return () => ignore = true 
    }, [])
    */ 
    
    return (<>
        {/* 轮播图 */}
        { renderSwiper(swiperData, i => console.log('indexChange: ', i), i => Toast.show(`你点击了卡片 ${i + 1}`)) }

        {/* 导航菜单 */}
        { renderNav(navData, item => navigate(item.path)) }

        {/* 租房小组 */}
        { renderGroup(groupData) }

        {/* 最新资讯 */}
        { renderNews(newsData) }

        {/* 顶部搜索 */}
        { renderHeaderSearch(city ? city.label : '--', () => navigate('/cityList'), () => navigate('/search'), () => navigate('/map')) }
    </>)
}