import { Toast } from 'antd-mobile'
import { useNavigate } from "react-router-dom";

import './CityList.scss'
import useData from '../utils/useData'

import { useState, useRef } from "react";
// import requestCurrentCity from "../utils/requestCurrentCity";

import { List, AutoSizer } from "react-virtualized";
import NavHeader from "../components/NavHeader";

import useCurrentCity from "../utils/useCurrentCity";

// 城市列表数据处理
function cityDataHandle(data) {
    if (data && data.body && Array.isArray(data.body) && data.body.length > 0) {
        // 有数据
        // 键是首字母，值是一个数组：对应首字母的城市信息
        const cityList = {}
        data.body.forEach(element => {
            const firstL = element.short[0]
            if (cityList[firstL]) {
                cityList[firstL].push(element)
            } else {
                cityList[firstL] = [element]
            }
        });
        const result = { cityList, cityKeys: Object.keys(cityList).sort() }
        return result
    } else {
        return {}
    }
}

export default function CityList() {
    const navigate = useNavigate()

    // 获取城市列表数据
    const { data: cityData } = useData.get('area/city', { 'level': '1' })
    console.log('cityData: ', cityData);
    // 城市列表数据处理
    const { cityList, cityKeys } = cityDataHandle(cityData)

    // 获取热门城市数据
    const { data: hotData } = useData.get('area/hot')
    console.log('hotData: ', hotData);
    if (cityList && cityKeys && hotData && hotData.body && Array.isArray(hotData.body) && hotData.body.length > 0) {
        cityList['hot'] = hotData.body
        cityKeys.unshift('hot')
    }

    // 获取当前城市
    /*
    const [currentCity, setCurrentCity] = useState(null)
    useEffect(() => {
        let ignore = false
        requestCurrentCity().then((data) => {
            if (!ignore) {
                setCurrentCity(data)
            }
        })
        return () => ignore = true
    }, [])
    */ 
    const { currentCity } = useCurrentCity()
    if (currentCity && cityList) {
        cityList['#'] = [currentCity]
        cityKeys.unshift('#')
    }
    console.log('cityList: ', cityList);
    console.log('cityKeys: ', cityKeys);

    // 高亮索引
    const [activeIndex, setActiveIndex] = useState(0)

    // 列表 ref
    const listRef = useRef(null)
    
    // 渲染每一行
    function rowRenderer({
            index, // 索引号
            isScrolling, // 当前项是否正在滚动中
            isVisible, // 当前项在List中是可见的
            key, // 渲染数组中行的唯一键
            parent, // 对父List（实例）的引用
            style, // 重点属性：一定要给每一个行数添加该样式
        }){
        let title = cityKeys[index]
        const citys = cityList[title]
        switch (title) {
            case '#':
                title = '当前定位'
                break;
            case 'hot':
                title = '热门城市'
                break
            default:
                break;
        }
        console.log('index: ', index);
        console.log('key: ', key);
        console.log('style: ', style);
        
        return (
            <div key={key} style={style} className='city'>
                <div className='title'>{title}</div>
                {
                    citys.map((item, i) => {
                        return <div className='name' key={item.value} onClick={() => {
                            const hotList = cityList['hot']
                            let contain = false
                            for (const i in hotList) {
                                const v = hotList[i]
                                if (v.label === item.label) {
                                    contain = true
                                    break
                                }
                            }
                            if (contain) {
                                // 热门城市才有房源数据
                                localStorage.setItem('localCity', JSON.stringify({'label': item.label, 'value': item.value}))
                                navigate(-1)
                            } else {
                                Toast.show({ content: '该城市暂无房源数据', duration: 2000 })
                            }
                        }}>{item.label}</div>
                    })
                }
            </div>
        );
    }

    return (<div className='city-list'>
        {/* 导航栏 */}
        <NavHeader>城市列表</NavHeader>
        {/* <NavBar style={{
            '--height': '44px',
            '--border-bottom': '1px #eee solid',
            'color': '#333',
            'backgroundColor': '#f6f5f6'
          }} backIcon={<i className='iconfont icon-back'></i>} onBack={() => { navigate(-1)
        }}>城市列表</NavBar> */}

        {/* 城市列表 */}
        { cityKeys && <AutoSizer>
            { ({width, height}) => {
                return <List
                    width={width}
                    height={height}
                    rowCount={cityKeys.length}
                    rowHeight={({index}) => {
                        console.log('index: ', index);
                        const key = cityKeys[index]
                        const section = cityList[key]
                        console.log('section: ', section);
                        
                        return 20 + 44*section.length
                    }}
                    rowRenderer={rowRenderer} 
                    onRowsRendered={({startIndex}) => {
                        console.log('startIndex: ', startIndex);
                        
                        if (startIndex !== activeIndex) {
                            setActiveIndex(startIndex)
                        }
                    }}
                    scrollToAlignment='start'
                    ref={listRef}
                />
            } }
        </AutoSizer> }

        {/* 右侧索引 */}
        { cityKeys && <ul className='city-index'>
            {cityKeys.map((item, index) => <li className={activeIndex === index ? 'active' : ''} key={item} onClick={() => {
                listRef.current.measureAllRows()
                listRef.current.scrollToRow(index)
            }}>{item === 'hot' ? '热' : item}</li>)}
        </ul> }
    </div>)
}