import { NavBar } from "antd-mobile";
import { useNavigate } from "react-router-dom";
// import "./NavHeader.scss";
import PropTypes from "prop-types";
import styles from "./NavHeader.module.css";

export default function NavHeader({onBack, children, className, rightContent}) {
    const navigate = useNavigate()
    function backAction() {
        navigate(-1)
    }
    return (<NavBar className={className ? className : ''} style={{
        '--height': '44px',
        '--border-bottom': '1px #eee solid',
        'color': '#333',
        'backgroundColor': '#f6f5f6'
      }} onBack={onBack || backAction} backIcon={<i className="iconfont icon-back"></i>} right={rightContent}>
        {children}
    </NavBar>)
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onBack: PropTypes.func,
    rightContent: PropTypes.array
}