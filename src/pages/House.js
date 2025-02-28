import SearchHeader from "../components/SearchHeader";
import useCurrentCity from "../utils/useCurrentCity";
import styles from "./House.module.css";
import Filter from "../components/Filter";
import { useEffect, useRef, useState, Component } from "react";
import useData from "../utils/useData";
import { List, AutoSizer, WindowScroller, InfiniteLoader } from "react-virtualized";
import HouseItem from "../components/HouseItem";
import { instance } from "../utils/api";
import requestCurrentCity from "../utils/requestCurrentCity";
import { Toast } from "antd-mobile";
import { baseUrl } from "../utils/constValue";
import { useNavigate } from "react-router-dom";


export default function House() {
    // 获取当前城市定位
    const { currentCity } = useCurrentCity()
    console.log('currentCity: ', currentCity);

    const [ filters, setFilters ] = useState({})

    // 获取房屋列表数据
    const { data: listData } = useData.get('/houses', {
        cityId: currentCity.value,
        ...filters,
        start: 1,
        end: 20
    })
    console.log('listData: ', listData);

    const [list, setList] = useState([])
    const listString = JSON.stringify(listData)
    const filtersString = JSON.stringify(filters)
    useEffect(() => {
        if (listString) {
            const data = JSON.parse(listString)
            const initList = data ? data.body.list : []
            console.log('initList: ', initList);
            setList(() => initList)

            if (data && data.body.count !== 0) {
                Toast.show(`共找到 ${data.body.count} 套房源`)
            }
        }
        return () => setList([])
    }, [listString, filtersString])

    const count = listData ? listData.body.count : 0
    console.log('count: ', count);

    const listRef = useRef(null)
    const navigate = useNavigate()
    function renderList() {
        if (count === 0) {
            return <div className={styles.noData}>
                <img className={styles.img} src={baseUrl + '/img/not-found.png'} alt="暂无数据"/>
                <p className={styles.msg}>没有找到房源，请您换个搜索条件吧~</p>
            </div>
        }
        return <InfiniteLoader
        isRowLoaded={({index}) => {
            console.log('isRowLoaded index: ', index);
            const isRowLoaded = !!list[index]
            console.log('isRowLoaded: ', isRowLoaded);
            return isRowLoaded
        }}
        loadMoreRows={({startIndex, stopIndex}) => {
            console.log('startIndex: ', startIndex);
            console.log('stopIndex: ', stopIndex);
            
            return new Promise((resolve, reject) => {
                instance.get('/houses', {params: {
                    ...filters, 
                    cityId: currentCity.value, 
                    start: startIndex + 1, 
                    end: stopIndex + 1
                }}).then((moreData) => {
                    if (moreData) {
                        const more = moreData.body.list
                        const total = list.concat(more)
                        setList(total)
                        console.log('total: ', total);
                    }
                    resolve(moreData)
                }).catch((error) => reject(error))
            })
        }}
        rowCount={count}
        minimumBatchSize={20}
        threshold={1}
        >
            {({onRowsRendered, registerChild}) => {
                console.log('registerChild: ', registerChild);
                return <AutoSizer>
                    { ({width, height}) => {
                        console.log('width: ', width);
                        console.log('height: ', height);
                        
                        return <div ref={registerChild}>
                            <List
                            onRowsRendered={onRowsRendered}
                            ref={listRef}
                            width={width}
                            height={height}
                            rowCount={list.length}
                            rowHeight={110}
                            rowRenderer={({index, key, style}) => {
                                console.log('index: ', index);
                                const item = list[index]
                                if (item) {
                                    return (<div key={key} style={style} className={styles.houseBody}>
                                        <HouseItem item={item} onClick={() => {navigate('/detail/' + item.houseCode)}}></HouseItem>
                                    </div>)
                                }
                                return null
                            }} 
                            />
                        </div>
                    } }
                </AutoSizer>
            }}
        </InfiniteLoader>
    }

    return (<div className={styles.root}>
        {/* 搜索导航栏 */}
        <SearchHeader className={styles.header} cityName={currentCity.label ? currentCity.label : '--'}></SearchHeader>

        {/* 选择器 */}
        <Filter onFilter={(filters) => {
            setFilters(filters)
            listRef.current && listRef.current.scrollToRow(0)
        }}></Filter>

        {/* 房屋列表 */}
        <div className={styles.houseItems}>
            {renderList()}
        </div>
    </div>)
}