import { Link } from "react-router-dom";
import styles from "./navigation.module.scss";

function CommonNav() {
  return (
    <footer className={styles.footer}>
      <div className={styles.submit__container}>
        <Link to={`/posts/edit`}>
          <button className={styles.submit__btn}>작성하기</button>
        </Link>
      </div>
      <div className={styles.pagination}>
        <button className={styles.prev__page}>1</button>
        <button className={styles.next__page}>2</button>
      </div>
    </footer>
  );
}

export default CommonNav;
