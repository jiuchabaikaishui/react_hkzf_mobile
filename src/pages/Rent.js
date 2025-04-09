import { Link, useNavigate } from "react-router-dom";
import NavHeader from "../components/NavHeader";
import NoHouse from "../components/NoHouse";
import useData from "../utils/useData"
import styles from "./Rent.module.css";
import HouseItem from "../components/HouseItem";

function renderNoHouse() {
    return <NoHouse>
        您还没有房源，<Link to='/rent/add' className={styles.link}>去发布房源</Link>吧~
    </NoHouse>
}
function renderList(list, navigate) {
    return list.map((value) => {
        return <HouseItem key={value.houseCode} item={value} onClick={() => {navigate('/detail/' + value.houseCode)}}></HouseItem>
    })
}
export default function Rent() {
    // 获取已发布房源数据
    const {data: rentData} = useData.get('/user/houses')
    console.log('rent data: ', rentData);
    const list = rentData && rentData.body ? rentData.body : []
    const navigate = useNavigate()
    return (<div className={styles.root}>
        <NavHeader className={styles.navigate}>房屋管理</NavHeader>
        {list.length > 0 ? renderList(list, navigate) : renderNoHouse()}
    </div>)
}