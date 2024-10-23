import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import { userLogout } from "../../utils/api";
import { signinState, userState } from "../../state/authState";
import { useRecoilValue, useSetRecoilState } from "recoil";

function CommonHeader() {
  const setSigninState = useSetRecoilState(signinState);
  const user = useRecoilValue(userState);
  const logout = async () => {
    try {
      const response = await userLogout();
      console.log(response);
      if (response.status === 204) {
        setSigninState({ isLoading: false, error: null, success: false });
      }
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
          <p>
            <strong> [{user.nickname}]</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommonHeader;
