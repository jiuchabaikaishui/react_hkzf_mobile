import styles from "./FilterMore.module.css";
import FilterFooter from "./FilterFooter";
import { useState } from "react";

export default function FilterMore({data: {roomType, oriented, floor, characteristic}, defaultValues, cancelAction, confirmAction}) {
    const [selectedValues, setSelectedValues] = useState(defaultValues)
    function renderFilters(data) {
        return data && data.map((item) => {
            const selected = selectedValues.indexOf(item.value) >= 0
            return <span 
            key={item.value} 
            className={styles.tag + (selected ? ' ' + styles.tagActive : '')}
            onClick={() => {
                console.log('xxxx');
                
                const result = [...selectedValues]
                const index = result.indexOf(item.value)
                if (index >= 0) {
                    // 已选中, 移除
                    result.splice(index, 1)
                } else {
                    // 未选中，加入
                    result.push(item.value)
                }
                setSelectedValues(result)
            }}
            >{item.label}</span>
        })
    }
    return (<div className={styles.root}>
        <div className={styles.mask} onClick={cancelAction}></div>
        <div className={styles.tags}>
            <dl className={styles.dl}>
                <dt className={styles.dt}>户型</dt>
                <dd className={styles.dd}>
                    {renderFilters(roomType)}
                </dd>
                <dt className={styles.dt}>朝向</dt>
                <dd className={styles.dd}>
                    {renderFilters(oriented)}
                </dd>
                <dt className={styles.dt}>楼层</dt>
                <dd className={styles.dd}>
                    {renderFilters(floor)}
                </dd>
                <dt className={styles.dt}>房屋亮点</dt>
                <dd className={styles.dd}>
                    {renderFilters(characteristic)}
                </dd>
            </dl>
        </div>
        <FilterFooter 
        className={styles.footer} 
        cancelText="清除" 
        cancelAction={() => setSelectedValues([])}
        confirmAction={() => confirmAction(selectedValues)}
        ></FilterFooter>
    </div>)
}