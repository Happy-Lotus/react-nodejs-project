import { Link, useNavigate } from "react-router-dom";
import styles from "./styles/header.module.scss";
import { useLogout } from "../utils/api";
import { signinState, userState } from "../state/authState";
import { useRecoilValue, useSetRecoilState } from "recoil";

function CommonHeader() {
  const setSigninState = useSetRecoilState(signinState);
  const setUserState = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const { userLogout } = useLogout();
  const logout = async () => {
    await userLogout();
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
