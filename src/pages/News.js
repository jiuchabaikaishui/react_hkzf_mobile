// import { animated, useSpring } from '@react-spring/web'
import { Link, useNavigate } from "react-router-dom";
import styles from "./News.module.css";
import NavHeader from "../components/NavHeader";

export default function News() {
    const navigate = useNavigate()
    return (<div className={styles.root}>
        <h3>其他页面</h3>
        <ul>
            <li><Link to='/rent'>房屋管理</Link></li>
            <li><Link to='/formik'>formik</Link></li>
        </ul>
    </div>)
}