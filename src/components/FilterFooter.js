import styles from "./FilterFooter.module.css";

export default function FilterFooter({
    cancelText = '取消',
    confirmText = '确定',
    cancelAction,
    confirmAction,
    className
  }) {
    return (<div className={styles.bottom + (className ? ' ' + className : '')}>
        <button className={styles.button + ' ' + styles.cancel} onClick={cancelAction}>{cancelText}</button>
        <button className={styles.button + ' ' + styles.confirm} onClick={confirmAction}>{confirmText}</button>
    </div>)
}