import { useEffect, useState } from "react";
import styles from './Map.module.css'
import NavHeader from "../components/NavHeader";
import useCurrentCity from "../utils/useCurrentCity";
import { Link } from "react-router-dom";
import { instance } from "../utils/api";
// import { baseUrl } from "../utils/constValue";
import HouseItem from "../components/HouseItem";

// 解决脚手架中全局变量访问的问题
const BMapGL = window.BMapGL

function renderOverlays(id, zoom, map, setHouseList) {
    // 获取房源信息
    instance.get('area/map?id=' + id).then((data) => {
        console.log('house data: ', data);
        
        // 文本覆盖物
        data && data.body.forEach((item) => {
            if (zoom === 11 ) {
                createCircle(item, 13, map, setHouseList)
            } else if (zoom === 13) {
                createCircle(item, 15, map, setHouseList)
            } else if (zoom === 15) {
                console.log('setHouseList: ', setHouseList);
                createRect(item, map, setHouseList)
            }
        })
    })
}

// 覆盖物样式
const labelStyle = { 
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
    border: '0',
    padding: '0'
}

function createCircle(item, zoom, map, setHouseList) {
    // 覆盖物内容结构
    var content = `<div class=${styles.bubble}>
        <p class="${styles.name}">${item.label}</p>
        <p>${item.count}套</p>
    </div>`;
    const point = new BMapGL.Point(item.coord.longitude, item.coord.latitude)
    // 创建文本标注
    var label = new BMapGL.Label(content, { 
        // 设置标注的地理位置
        position: point, 
        // 设置标注的偏移量
        offset: new BMapGL.Size(-35, -35) 
    })  
    // 给label添加唯一标识
    label.id = item.value
    // 添加点击
    label.addEventListener('click', () => {
        // 清除覆盖物
        map.clearOverlays()

        // 设置中心点坐标和地图级别
        map.centerAndZoom(point, zoom)

        // 渲染下一级覆盖物
        renderOverlays(item.value, zoom, map, setHouseList)
    })
    map.addOverlay(label); 
    // 设置label的样式
    label.setStyle(labelStyle)
}

function createRect(item, map, setHouseList) {
    // 覆盖物内容结构
    var content = `<div class=${styles.rect}>
        <span class="${styles.housename}">${item.label}</span>
        <span class="${styles.housenum}">${item.count}套</span>
        <i class="${styles.arrow}"></i>
    </div>`;
    const point = new BMapGL.Point(item.coord.longitude, item.coord.latitude)
    // 创建文本标注
    var label = new BMapGL.Label(content, { 
        // 设置标注的地理位置
        position: point, 
        // 设置标注的偏移量
        offset: new BMapGL.Size(-50, -28) 
    })  
    // 给label添加唯一标识
    label.id = item.value
    // 添加点击
    label.addEventListener('click', (e) => {
        // 获取小区房源信息
        instance.get('houses?cityId=' + item.value).then((data) => {
            console.log('house data: ', data);
            // 保存数据，刷新组件
            setHouseList(data.body.list)

            // 调整地图位置（让点击的房源在中心位置）
            const x = window.innerWidth/2 - label.domElement.offsetLeft - 50
            const y = (window.innerHeight - 350)/2 - label.domElement.offsetTop - 28
            map.panBy(x, y)
        })
    })
    map.addOverlay(label); 
    // 设置label的样式
    label.setStyle(labelStyle)
}

export default function Map() {
    // 获取当前城市定位
    const { currentCity } = useCurrentCity()
    console.log('currentCity: ', currentCity);

    // 小区房源列表
    const [houseList, setHouseList] = useState(null)
    
    // 创建地图
    const { label: currentLabel, value: currentValue } = currentCity
    useEffect(() => {
        let ignore = false
        // 定位成功
        if (currentLabel) {
            // 创建地图实例  
            var map = new BMapGL.Map(styles.container);          
            //开启鼠标滚轮缩放             
            map.enableScrollWheelZoom(true);     

            // 添加比例尺控件
            var scaleCtrl = new BMapGL.ScaleControl();  
            map.addControl(scaleCtrl);
            // 添加缩放控件
            var zoomCtrl = new BMapGL.ZoomControl();  
            map.addControl(zoomCtrl);

            //创建地址解析器实例
            var myGeo = new BMapGL.Geocoder();

            console.log('map1: ', map);
            
            // 将地址解析结果显示在地图上，并调整地图视野
            myGeo.getPoint(currentLabel, function(point){
                if (!ignore) {
                    let p = null
                    if(point){
                        console.log('point: ', point);
                        // 地址解析成功
                        p = point
                    }else{
                        alert('您选择的地址没有解析到结果！');
                        // 地址解析失败，创建默认点坐标 （北京）
                        p = new BMapGL.Point(116.404, 39.915);  
                    }
    
                    // 设置中心点坐标和地图级别
                    const zoom = 11
                    console.log('map2: ', map);
                    map.centerAndZoom(p, zoom);  
                    
                    // 渲染覆盖物
                    renderOverlays(currentValue, zoom, map, setHouseList)
                }
            }, currentLabel)
        }

        return () => ignore = true
    }, [currentLabel, currentValue])

    console.log('house list: ', houseList);
    
    return <div className={styles.map}>
        {/* 导航栏 */}
        <NavHeader>地图找房</NavHeader>

        {/* 地图 */}
        <div id={styles.container}></div>

        {/* 房屋列表 */}
        { houseList && <div className={styles.houseList + (houseList ? ` ${styles.show}` : '')}>
            <div className={styles.listWrap}>
                <span className={styles.listTitle}>房屋列表</span>
                <Link to='/home/list' className={styles.listMore}>更多房源</Link>
            </div>
            <div className={styles.houseItems}>
                { houseList.map((item) => {
                    return <HouseItem item={item}></HouseItem>
                    // return <div key={item.value} className={styles.houseItem}>
                    //     <img className={styles.itemLeft} src={baseUrl + item.houseImg} alt=""></img>
                    //     <div className={styles.itemRight}>
                    //         <div className={styles.itemTitle}>{item.title}</div>
                    //         <div className={styles.itemDesc}>{item.desc}</div>
                    //         <div>
                    //             { item.tags && item.tags.map((tag, i) => {
                    //                 const tagClass = 'tag' + (1 + i%3)
                    //                 return <span className={styles.tags + ' ' + styles[tagClass]} key={tag}>{tag}</span>
                    //             }) }
                    //         </div>
                    //         <div className={styles.price}>
                    //             <span className={styles.priceNum}>{item.price}</span>
                    //             元/月
                    //         </div>
                    //     </div>
                    // </div>
                }) }
            </div>
        </div> }
    </div>
}