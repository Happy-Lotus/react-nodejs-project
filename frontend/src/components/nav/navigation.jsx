import styles from "./navigation.module.scss";

function CommonNav() {
  return (
    <footer className={styles.footer}>
      <div className={styles.pagination}>
        <button className={styles.prev__page}>1</button>
        <button className={styles.next__page}>2</button>
      </div>
      <div className={styles.submit__container}>
        <button className={styles.submit__btn}>작성하기</button>
      </div>
    </footer>
  );
}

export default CommonNav;
