import { Link } from "react-router-dom";
import styles from "./header.module.scss";

function CommonHeader() {
  return (
    <div className={styles.header__container}>
      {" "}
      {/**container */}
      <div className={styles.header}>
        {" "}
        {/**wrap */}
        <div className={styles.header__logoBox}>
          <Link to={`/posts`}>
            <span>Main</span>
          </Link>
        </div>
        <div className={styles.header__profileBox}>
          <button className={styles.header__profileBox__button}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
}

export default CommonHeader;
