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
    // try {
    //   const response = await userLogout();
    //   console.log(response);
    //   if (response.status === 204) {
    //     setSigninState({ isLoading: false, error: null, success: false });
    //     setUserState({ nickname: "" });
    //   }
    //   toast.success("로그아웃했습니다.");
    //   setTimeout(() => {
    //     navigate("/login"); // 로그인 페이지로 리디렉션
    //   }, 100); // 잠시 대기 후 리디렉션
    // } catch (error) {
    //   setSigninState({ isLoading: false, error: null, success: false });
    //   setUserState({ nickname: "" });
    //   toast.error("로그아웃했습니다.");
    //   setTimeout(() => {
    //     navigate("/login"); // 로그인 페이지로 리디렉션
    //   }, 100); // 잠시 대기 후 리디렉션
    // }
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
