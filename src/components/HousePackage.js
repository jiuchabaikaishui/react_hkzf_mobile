import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./HousePackage.module.css";

// 所有房屋配置项
const HOUSE_PACKAGE = [
    {
      id: 1,
      name: '衣柜',
      icon: 'icon-wardrobe'
    },
    {
      id: 2,
      name: '洗衣机',
      icon: 'icon-wash'
    },
    {
      id: 3,
      name: '空调',
      icon: 'icon-air'
    },
    {
      id: 4,
      name: '天然气',
      icon: 'icon-gas'
    },
    {
      id: 5,
      name: '冰箱',
      icon: 'icon-ref'
    },
    {
      id: 6,
      name: '暖气',
      icon: 'icon-Heat'
    },
    {
      id: 7,
      name: '电视',
      icon: 'icon-vid'
    },
    {
      id: 8,
      name: '热水器',
      icon: 'icon-heater'
    },
    {
      id: 9,
      name: '宽带',
      icon: 'icon-broadband'
    },
    {
      id: 10,
      name: '沙发',
      icon: 'icon-sofa'
    }
]

export default function HousePackage({supporting = [], onSelect = () => {}}) {
    // 选中的配套名称
    console.log('supporting: ', supporting);
    
    const [selectedNames, setSelectedNames] = useState(supporting)

    return (<>
        {/* 房屋配套 */}
        <div className={styles.aboutList}>
            {HOUSE_PACKAGE.map((item, i) => {
                const si = selectedNames.indexOf(item.name)
                return <div className={styles.aboutItem + (si > -1 ? ' ' + styles.aboutActive : '')} key={item.id} onClick={() => {
                    console.log('si: ', si);
                    const newNames = [...selectedNames]
                    if (si > -1) {
                        newNames.splice(si, 1)
                    } else {
                        newNames.push(item.name)
                    }
                    // 修改选中
                    setSelectedNames(newNames)
                    // 将值传递给父组件
                    onSelect(newNames)
                }}>
                    <p className={styles.aboutValue}>
                        <i className={`iconfont ${item.icon} ${styles.icon}`} />
                    </p>
                    <div>{item.name}</div>
                </div>
            })}
        </div>
    </>)
}

HousePackage.propTypes = {
    supporting: PropTypes.string,
    onSelect: PropTypes.func
}