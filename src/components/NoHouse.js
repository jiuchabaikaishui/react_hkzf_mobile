import styles from "./NoHouse.module.css";
import PropTypes from "prop-types";
import { baseUrl } from "../utils/constValue";

export default function NoHouse(props) {
    return <div className={styles.noData}>
        <img className={styles.img} src={baseUrl + '/img/not-found.png'} alt="暂无数据"/>
        <p className={styles.msg}>{props.children}</p>
    </div>
}

NoHouse.propTypes = {
    //  node（任何可以渲染的内容）
    children: PropTypes.node.isRequired
}