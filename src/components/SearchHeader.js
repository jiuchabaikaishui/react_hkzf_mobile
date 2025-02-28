import PropTypes from "prop-types";
import "../pages/Home.scss";
import { useNavigate } from "react-router-dom";

export default function SearchHeader({cityName, className, onClickLoction, onClickSearch, onClickMap}) {
    const navigate = useNavigate()
    function locationAction() {
        navigate('/cityList')
    }
    function searchAction() {
        navigate('/search')
    }
    function mapAction() {
        navigate('/map')
    }
    return <div className={'headerSearch' + (className ? ' ' + className : '')}>
        <div className='search'>
            <div className='location' onClick={onClickLoction || locationAction}>
                <span className="name">{cityName}</span>
                <i className="iconfont icon-arrow" />
            </div>
            <div className='form' onClick={onClickSearch || searchAction}>
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
            </div>
        </div>
        <div className="iconfont icon-map" onClick={onClickMap || mapAction}></div>
    </div>
}

SearchHeader.propTypes = {
    cityName: PropTypes.string.isRequired,
    onClickLoction: PropTypes.func,
    onClickSearch: PropTypes.func,
    onClickMap: PropTypes.func
}