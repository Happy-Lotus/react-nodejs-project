import styles from './header.module.scss'


function CommonHeader() {

    return <header className={styles.header}>
        <div className={styles.header__logoBox} >
            <span className={styles.header__logoBox__title}>목록</span>
        </div>
        <div className={styles.header__profileBox}>
            <button className={styles.header__profileBox__button}>로그아웃</button>
        </div>
    </header>
}

export default CommonHeader