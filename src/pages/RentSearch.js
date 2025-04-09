import { SearchBar } from "antd-mobile";
import styles from "./RentSearch.module.css";
import { useState } from "react";
import { instance } from "../utils/api";
import useCurrentCity from "../utils/useCurrentCity";
import { replace, useNavigate } from "react-router-dom";

let timer = null

export default function RentSearch() {
    const [searchText, setSearchText] = useState('')
    const {currentCity} = useCurrentCity()
    const [list, setList] = useState([])
    console.log('current city: ', currentCity);
    const navigate = useNavigate()
    return <div className={styles.root}>
        {/* 搜索栏 */}
        <SearchBar className={styles.searchBar} placeholder="请输入小区名称" showCancelButton value={searchText} onChange={(value) => {
            console.log('searchText: ', value);
            
            if (value) {
                console.log('timer: ', timer);
                
                if (timer) {
                    clearTimeout(timer)
                    timer = null
                }
                timer = setTimeout(() => {
                    instance.get('/area/community', {params: {name: value, id: currentCity.value}}).then((data) => {
                        console.log('search data: ', data);
                        setList(data.body)
                    })
                }, 500);
            } else {
                setList([])
            }
            setSearchText(value)
        }}></SearchBar>

        {/* 搜索项 */}
        <ul className={styles.list}>
            {list.map((v) => <li key={v.community} className={styles.item} onClick={() => {
                navigate('/rent/add', {replace: true, state: {community: v}})
            }}>{v.communityName}</li>)}
        </ul>
    </div>
}