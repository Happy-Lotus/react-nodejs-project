import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { userLogout } from "../../utils/api";

function CommonHeader() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await userLogout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

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
          <button
            className={styles.header__profileBox__button}
            onClick={logout}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonHeader;
