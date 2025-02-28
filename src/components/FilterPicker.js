import styles from "./FilterPicker.module.css";
import { PickerView } from "antd-mobile";
import { useState } from "react";
import FilterFooter from "./FilterFooter";

export default function FilterPicker({cancelAction, confirmAction, data, type, defaultValue}) {
    // 计算选择器数据
    function calculateColumns(vs) {
        const result = [data]
        if (type !== 'area') {
            return result
        }
        if (vs.length > 0) {
            const v1 = vs[0]
            if (v1) {
                const item1 = data.find((value) => value.value === v1)
                if (item1 && item1.children) {
                    result.push(item1.children)
                    if (vs.length > 1) {
                        const v2 = vs[1]
                        if (v2) {
                            const item2 = item1.children.find((value) => value.value === v2)
                            if (item2 && item2.children) {
                                result.push(item2.children)
                            }
                        }
                    }
                }
            }
        }
        if (result.length === 1) {
            result.push([], [])
        } else if (result.length === 2) {
            result.push([])
        }
        console.log('result: ', result);
        
        return result
    }

    console.log('defaultValue: ', defaultValue);
    

    // 选中值
    const [selectedValue, setSelectedValue] = useState(null)
    return (<div className={styles.root}>
        {/* 选择器 */}
        <PickerView 
        columns={(v) => {
            console.log('cv: ', v);
            return calculateColumns(v)
        }} 
        onChange={(v) => {
            setSelectedValue(v)
        }}
        defaultValue={defaultValue}
        ></PickerView>

        {/* 底部按钮 */}
        <FilterFooter cancelAction={cancelAction} confirmAction={() => confirmAction(selectedValue)}></FilterFooter>
    </div>)
}