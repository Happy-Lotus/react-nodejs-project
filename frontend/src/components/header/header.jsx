import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { userLogout } from "../../utils/api";
import { signinState } from "../../state/authState";
import { useSetRecoilState } from "recoil";

function CommonHeader() {
  const navigate = useNavigate();
  const setSigninState = useSetRecoilState(signinState);
  const logout = async () => {
    try {
      const response = await userLogout();
      if (response.status === 204) {
        setSigninState({ isLoading: false, error: null, success: false });
      }
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
