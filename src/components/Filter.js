import FilterTitle from "./FilterTitle";
import { useState } from "react";
import styles from "./Filter.module.css";
import FilterPicker from "./FilterPicker";
import useCurrentCity from "../utils/useCurrentCity";
import useData from "../utils/useData";
import FilterMore from "./FilterMore";
import { animated, useSpring } from '@react-spring/web'


// 默认标题高亮状态
// true 表示高亮； false 表示不高亮
const initStatus = {
    area: false,
    mode: false,
    price: false,
    more: false
}
// 默认选择器选中值
const initValues = {
    area: ['area', 'null'],
    mode: ['null'],
    price: ['null'],
    more: []
}

export default function Filter({onFilter}) {
    // 状态
    const [status, setStatus] = useState(initStatus)
    // 打开的选择器类型
    const [openType, setOpenType] = useState('')
    // 当前城市
    const {currentCity} = useCurrentCity()
    // 筛选数据
    const {data: filtersData} = currentCity && useData.get(`/houses/condition?id=${currentCity.value}`)
    console.log('filtersData: ', filtersData);

    // 是否显示遮罩
    const showMask = openType === 'area' || openType === 'mode' || openType === 'price'

    // 选择器选中值
    const [selectedValues, setSelectedValues] = useState(initValues)

    // 根据选中值更新标题高亮状态
    function updateTitleStatus(selectedValue) {
        console.log('status: ', status);
        console.log('selectedValue: ', selectedValue);
        
        const newStatus = {...status}
        if (openType === 'area') {
            newStatus[openType] = selectedValue[0] !== openType || selectedValue[1] !== 'null'
        } else if (openType === 'more') {
            newStatus[openType] = selectedValue.length > 0
        } else {
            newStatus[openType] = selectedValue[0] !== 'null'
        }
        console.log('newStatus: ', newStatus);
        setStatus(newStatus)
    }
    function cancelAction() {
        // 根据原本选中的值则修改当前标题高亮状态
        const selectedValue = selectedValues[openType]
        updateTitleStatus(selectedValue)
        
        // 取消时隐藏对话框
        setOpenType('')
    }
    function confirmAction(selectedValue) {
        // 保存选中值
        console.log('selectedValue: ', selectedValue);
        const vs = {...selectedValues, [openType]: selectedValue}
        console.log('vs: ', vs);
        setSelectedValues(vs)

        // 选中了值则修改当前标题为高亮
        updateTitleStatus(selectedValue)

        // 确认时隐藏对话框
        setOpenType('')

        // 筛选条件数据
        const filters = {};
        const { area, mode, price, more } = vs;
        // 区域
        filters[area[0]] = area[area.length - 1]
        // 方式和租金
        filters['rentType'] = mode[0]
        filters['price'] = price[0]
        // 更多
        filters['more'] = more.join(',')
        onFilter(filters)
    }

    // 渲染选择器
    function renderFilterPicker() {
        if (showMask && filtersData) {
            // 数据
            let data = []
            switch (openType) {
                case 'area':
                    data = [filtersData.body['area'], filtersData.body['subway']]
                    break;
                case 'mode':
                    data = filtersData.body['rentType']
                    break;
                case 'price':
                    data = filtersData.body['price']
                    break;
            
                default:
                    break;
            }
            console.log('data: ', data);
            
            return <FilterPicker 
            key={openType}
            cancelAction={cancelAction} 
            confirmAction={confirmAction} 
            data={data} 
            type={openType} 
            defaultValue={selectedValues[openType]}
            ></FilterPicker>
        }
        if (openType === 'more' && filtersData) {
            return <FilterMore 
            data={{
                roomType: filtersData.body['roomType'], 
                oriented: filtersData.body['oriented'], 
                floor: filtersData.body['floor'], 
                characteristic: filtersData.body['characteristic']
            }}
            defaultValues={selectedValues['more']}
            cancelAction={cancelAction}
            confirmAction={confirmAction}
            ></FilterMore>
        }
        return null
    }

    const props = useSpring({
        from: { opacity: 0 },
        to: { opacity: showMask ? 1 : 0 }
    })

    return (<div className={styles.root}>
        {/* 遮罩 */}
        <animated.div style={props}>
            { showMask ? <div className={styles.mask} onClick={cancelAction}></div> : null }
        </animated.div>

        <div className={styles.content}>
            {/* 标题 */}
            <FilterTitle 
            selectedStatus={status}
            selectAction={(item) => {
                const s = {...status}
                const selectedValue = selectedValues[openType]
                if (openType === 'area') {
                    s[openType] = selectedValue[0] !== openType || selectedValue[1] !== 'null'
                } else if (openType === 'more') {
                    s[openType] = selectedValue.length > 0
                } else if (openType !== '') {
                    s[openType] = selectedValue[0] !== 'null'
                }
                s[item.type] = true
                console.log('s: ', s);
                
                setStatus(s)
                setOpenType(item.type)
            }}></FilterTitle>

            {/* 内容选择器 */}
            { renderFilterPicker() }
        </div>
    </div>)
}
