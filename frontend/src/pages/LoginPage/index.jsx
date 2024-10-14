import { useForm } from "react-hook-form";
import styles from "./LoginPage.module.scss";
import { useLogin } from "../../utils/api"; // API 요청 로직 import
import { useRecoilValue } from "recoil";
import { signinState } from "../../state/authState";
import { useNavigate } from "react-router-dom"; // useHistory import
import { useCookies } from "react-cookie";

const LoginPage = () => {
  const [cookies, setCookie] = useCookies(["AccessToken", "RefreshToken"]);
  const { signin } = useLogin();
  const signinStatus = useRecoilValue(signinState);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
    reset,
    trigger,
    clearErrors,
  } = useForm();
  // const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const response = await signin(data);
      // const { AccessToken, RefreshToken } = response.headers[
      //   "set-cookie"
      // ].reduce((acc, cookie) => {
      //   const [name, value] = cookie.split(";")[0].split("=");
      //   acc[name] = value;
      //   return acc;
      // }, {});

      // setCookie("AccessToken", AccessToken, { path: "/" }); // 쿠키 저장
      // setCookie("RefreshToken", RefreshToken, { path: "/" }); // 쿠키 저장
      // reset();
      navigate("/posts");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.background__color__container}>
      <section className={styles.signup__container}>
        <div className={styles.signup__box}>
          <h1 className={styles.signup__box__tile}>Login</h1>
          <form
            className={styles.signup__box__form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.form__group}>
              <input
                type="email"
                id="email"
                className={styles.form__group__input}
                placeholder="이메일 입력"
                aria-invalid={
                  isSubmitted ? (errors.email ? "true" : "false") : undefined
                }
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "이메일 형식에 맞지 않습니다.",
                  },
                  onChange: (e) => {
                    if (e.target.value) {
                      trigger("email");
                    }
                  },
                })}
              />
              <input
                type="password"
                id="pwd"
                className={styles.form__group__input}
                placeholder="비밀번호 입력"
                {...register("pwd", {
                  required: true,
                  pattern: {
                    value:
                      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,12}$/,
                    message:
                      "영문 대/소문자, 숫자, 특수문자 포함 8-12자리여야 합니다.",
                  },
                  onChange: (e) => {
                    if (e.target.value) {
                      clearErrors("pwd"); // 에러 메시지 제거
                    }
                  },
                })}
              />
            </div>
            {(errors.email || errors.password) && (
              <span className={styles.error_msg}>{errors.email.message}</span>
            )}
            <div className={styles.form__actions}>
              <button type="submit" className={styles.btn__submit}>
                로그인
              </button>
            </div>
            <p className={styles.login__prompt}>
              <a href="/" className={styles.login_prompt__link}>
                회원가입
              </a>
            </p>
            {signinStatus.isLoading && <p>로그인 중...</p>}
            {signinStatus.error && <p>{signinStatus.error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
