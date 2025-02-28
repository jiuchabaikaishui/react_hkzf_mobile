import styles from "./FilterTitle.module.css";

// 条件筛选栏标题数组：
const titleList = [
    { title: "区域", type: "area" },
    { title: "方式", type: "mode" },
    { title: "租金", type: "price" },
    { title: "筛选", type: "more" }
];

export default function FilterTitle({ selectedStatus, selectAction }) {
    return (<div className={styles.root}>
        {titleList.map((item) => {
            // 父组件传递过来的状态
            const selected = selectedStatus[item.type]
            return <div 
                key={item.type} 
                className={styles.dropdown + (selected ? ' ' + styles.selected : '')}
                onClick={() => {
                    selectAction(item)
                }}>
                <span>{item.title}</span>
                <i className="iconfont icon-arrow"></i>
            </div>
        })}
    </div>)
}