import styles from "./HouseItem.module.css";
import { baseUrl } from "../utils/constValue";

export default function HouseItem({item, onClick}) {
    // console.log('item: ', item);
    
    return (
        <div key={item.value} className={styles.houseItem} onClick={onClick}>
            <img className={styles.itemLeft} src={baseUrl + item.houseImg} alt=""></img>
            <div className={styles.itemRight}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemDesc}>{item.desc}</div>
                <div>
                    { item.tags && item.tags.map((tag, i) => {
                        const tagClass = 'tag' + (1 + i%3)
                        return <span className={styles.tags + ' ' + styles[tagClass]} key={tag}>{tag}</span>
                    }) }
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span>
                    元/月
                </div>
            </div>
        </div>
    )
}