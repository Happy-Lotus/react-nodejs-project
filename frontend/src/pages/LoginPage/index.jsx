import { useForm } from "react-hook-form";
import styles from "./LoginPage.module.scss";
import { useLogin } from "../../utils/api"; // API 요청 로직 import
import { useRecoilValue } from "recoil";
import { signinState } from "../../state/authState";
import { useNavigate } from "react-router-dom"; // useHistory import
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useEffect } from "react";

const LoginPage = () => {
  const { signin } = useLogin();
  const signinStatus = useRecoilValue(signinState);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log("로그인 시도:", data);

    // 유효성 검사 결과 확인
    console.log(data.email);

    if (!data.email) {
      toast.error("이메일을 입력하세요");
      return;
    }

    if (!/^[\w-\.]+@gmail\.com$/.test(data.email)) {
      toast.error("이메일 형식이 올바르지 않습니다. 예시(example@gmail.com)"); // Show error for invalid email format
      return;
    }
    if (
      !data.pwd ||
      data.pwd.length < 8 ||
      data.pwd.length > 12 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(data.pwd)
    ) {
      toast.error("비밀번호는 8~12자리여야 하며 특수문자를 포함해야 합니다."); // Show error for invalid password
      return;
    }

    try {
      console.log("response 호출시도", data);
      await signin(data);
      navigate("/posts");
    } catch (error) {
      toast.error(); // Show error for incorrect email/password
      console.error(error);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
    reset,
    trigger,
    clearErrors,
    getValues,
  } = useForm({ mode: onSubmit });
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("useEffect");
  //   if (errors.email) {
  //     toast.error(errors.email.message);
  //   }
  //   if (errors.pwd) {
  //     toast.error(errors.pwd.message);
  //   }
  // }, [errors]);
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
                  required: "이메일은 필수입력입니다.",
                  onChange: (e) => {
                    clearErrors("email");
                  },
                  // pattern: {
                  //   value: /^[\w-\.]+@gmail\.com$/,
                  //   message:
                  //     "이메일 형식이 올바르지 않습니다. (예: example@gmail.com)",
                  // },
                })}
              />
              <input
                type="password"
                id="pwd"
                className={styles.form__group__input}
                placeholder="비밀번호 입력"
                {...register("pwd", {
                  required: "비밀번호는 필수입력입니다.",
                  onChange: (e) => {
                    clearErrors("pwd");
                  },
                  // pattern: {
                  //   value:
                  //     /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,12}$/,
                  //   message:
                  //     "영문 대/소문자, 숫자, 특수문자 포함 8-12자리여야 합니다.",
                  // },
                })}
              />
            </div>
            {errors.email && errors.pwd ? (
              <span className={styles.error_msg}>
                이메일과 비밀번호는 필수입력입니다.
              </span>
            ) : (
              <>
                {errors.email && (
                  <span className={styles.error_msg}>
                    {errors.email.message}
                  </span>
                )}
                {errors.pwd && (
                  <span className={styles.error_msg}>{errors.pwd.message}</span>
                )}
              </>
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
            {/* {signinStatus.isLoading && <p>로그인 중...</p>}
            {signinStatus.error && <p>{signinStatus.error}</p>} */}
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
