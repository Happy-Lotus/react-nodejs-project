import { useForm } from "react-hook-form";
import styles from "./RegisterPage.module.scss";
import { useState, useEffect } from "react";
import {
  checkNickname,
  useSignup,
  generateCode,
  verifyCode,
} from "../../utils/api"; // API 요청 로직 import
import { useRecoilValue } from "recoil";
import { signupState } from "../../state/authState";
import { useNavigate } from "react-router-dom"; // useHistory import

const RegisterPage = () => {
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const { signup } = useSignup();
  const signupStatus = useRecoilValue(signupState);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerified, setIsVerified] = useState([false, false]);
  const [timer, setTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false); // 인증 진행 중 상태
  const onSubmit = async (data) => {
    if (!isVerified[0] || !isVerified[1]) {
      alert("인증이 되지 않았습니다.");
      return;
    }
    try {
      const verify = isVerified[0] && isVerified[1] ? true : false;
      console.log(verify);
      await signup(data, verify);
      reset();
      alert("회원가입이 완료되었습니다");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitted, errors },
    getValues,
    clearErrors,
    reset,
    trigger,
  } = useForm();

  const checkDuplicate = async (nickname) => {
    const response = await checkNickname({ nickname });
    if (response) {
      alert("중복된 닉네임입니다.");
    } else {
      alert("사용 가능한 닉네임입니다.");
      setIsVerified((prev) => [true, ...prev.slice(1)]);
    }
  };

  const handleCheckDuplicate = () => {
    const nickname = getValues("nickname");
    if (nickname.trim() === "") {
      setDuplicateMessage("닉네임을 입력해주세요."); // 에러 메시지 추가
    } else {
      checkDuplicate(nickname);
    }
  };

  //이메일 인증 버튼 클릭
  const handleEmailVerification = async () => {
    const email = getValues("email");
    const response = await generateCode(email);
    console.log("이메일 인증 진행 후");
    if (response && response.status === 201) {
      alert("인증 코드가 발송되었습니다");
      setTimer(180);
    }
  };

  const handleCodeCheck = async () => {
    const code = parseInt(getValues("code"));
    const email = getValues("email");
    if (!code) {
      setErrorMessage("인증 코드를 입력해주세요.");
    } else {
      const response = await verifyCode(email, code);
      console.log(response);
      if (response.status === 200) {
        setIsVerified((prev) => [true, true]);
        setTimer(0);
        alert("인증이 완료되었습니다.");
        console.log(isVerified);
      } else {
        alert("인증 코드가 맞지 않습니다.");
      }
    }
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isVerifying && !isVerified[1]) {
      // 타이머가 0이 되었을 때만 알림 표시
      alert("인증코드가 만료되었습니다. 다시 인증해주세요."); // 알림 표시
      setIsVerified([true, false]); // 인증 상태 초기화
      setIsVerifying(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className={styles.background__color__container}>
      <section className={styles.signup__container}>
        <div className={styles.signup__box}>
          <h1 className={styles.signup__box__tile}>Signup</h1>
          <form
            className={styles.signup__box__form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.form__group}>
              <label htmlFor="name" className={styles.form__group__label}>
                이름
              </label>
              <div className={styles.form__group__input__noBtn}>
                <input
                  type="text"
                  id="name"
                  className={styles.form__group__input__box}
                  aria-invalid={
                    isSubmitted ? (errors.name ? "true" : "false") : undefined
                  }
                  {...register("name", {
                    required: "이름은 필수입력입니다.",
                    onChange: (e) => {
                      setIsTouched(true);
                      if (e.target.value) {
                        trigger("name");
                      }
                    },
                    onBlur: () => {
                      setIsTouched(true); // 포커스가 닉네임 필드를 벗어나면 isTouched 설정
                      trigger("name");
                    },
                  })}
                />
              </div>
            </div>
            {(!isTouched || errors.name) && isSubmitted && (
              <span className={styles.error_msg}>{errors.name.message}</span>
            )}
            <div className={styles.form__group}>
              <label htmlFor="nickname" className={styles.form__group__label}>
                닉네임
              </label>
              <div className={styles.form__group__input}>
                <input
                  type="text"
                  id="nickname"
                  className={styles.form__group__input__box}
                  aria-invalid={
                    isSubmitted
                      ? errors.nickname
                        ? "true"
                        : "false"
                      : undefined
                  }
                  {...register("nickname", {
                    required: "닉네임은 필수입력입니다.",
                    onChange: (e) => {
                      if (e.target.value) {
                        trigger("nickname");
                      }
                    },
                    onBlur: () => {
                      setIsTouched(true); // 포커스가 닉네임 필드를 벗어나면 isTouched 설정
                      trigger("nickname");
                    },
                  })}
                />

                <button
                  type="button"
                  className={styles.btn__check}
                  onClick={handleCheckDuplicate}
                >
                  중복확인
                </button>
              </div>
            </div>
            {/* {(!isTouched || errors.nickname) &&
              isSubmitted &&
              !duplicateMessage && (
                <span className={styles.error_msg}>
                  {errors.nickname.message}
                </span>
              )}
            {duplicateMessage && !errors.nickname && (
              <span className={styles.timer}>{duplicateMessage}</span>
            )} */}
            {/* {isSubmitted && (errors.nickname || duplicateMessage) && (
              <span
                className={
                  errors.nickname ? styles.error_msg : styles.available_msg
                }
              >
                {errors.nickname ? errors.nickname.message : duplicateMessage}
              </span>
            )} */}
            {(!isTouched || errors.nickname) &&
              isSubmitted &&
              !duplicateMessage && (
                <span className={styles.error_msg}>
                  {errors.nickname.message}
                </span>
              )}
            <div className={styles.form__group}>
              <label htmlFor="email" className={styles.form__group__label}>
                이메일
              </label>
              <div className={styles.form__group__input}>
                <input
                  type="email"
                  id="email"
                  className={styles.form__group__input__box}
                  aria-invalid={
                    isSubmitted ? (errors.email ? "true" : "false") : undefined
                  }
                  {...register("email", {
                    required: {
                      value: true,
                      message: "이메일은 필수 입력입니다.",
                    },
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
                <button
                  type="button"
                  className={styles.btn__check}
                  onClick={handleEmailVerification}
                >
                  이메일 인증
                </button>
              </div>
            </div>
            {errors.email && (
              <span className={styles.error_msg}>{errors.email.message}</span>
            )}
            <div className={styles.form__group}>
              <label htmlFor="code" className={styles.form__group__label}>
                인증코드
              </label>
              <div className={styles.form__group__input}>
                <input
                  type="number"
                  id="code"
                  className={styles.form__group__input__box}
                  aria-invalid={
                    isSubmitted
                      ? errors.verifyNumber
                        ? "true"
                        : "false"
                      : undefined
                  }
                  {...register("code", {
                    required: "이메일 인증이 완료되지 않았습니다.",
                    onChange: (e) => {
                      setCode(e.target.value);
                      if (e.target.value) {
                        trigger("code");
                        setErrorMessage(""); // 인증 메시지 초기화
                      }
                    },
                  })}
                  disabled={isVerified[1]}
                />

                <button
                  type="button"
                  className={styles.btn__check}
                  onClick={handleCodeCheck}
                >
                  확인
                </button>
              </div>
            </div>
            {timer > 0 && <span className={styles.timer}>{timer}초 남음</span>}
            {isSubmitted && (errors.code || errorMessage) && (
              <span
                className={
                  errors.code ? styles.error_msg : styles.available_msg
                }
              >
                {errors.code ? errors.code.message : errorMessage}
              </span>
            )}
            {isVerified[1] && <span className={styles.check_icon}>✔️</span>}
            <div className={styles.form__group}>
              {/**비밀번호 입력 */}
              <label htmlFor="pwd" className={styles.form__group__label}>
                비밀번호
              </label>
              <div className={styles.form__group__input__noBtn}>
                <input
                  type="password"
                  id="pwd"
                  className={styles.form__group__input__box}
                  placeholder="영문 대/소문자,숫자, 특수문자 포함 8-12자리"
                  {...register("pwd", {
                    required: "비밀번호는 필수 입력입니다.",
                    minLength: {
                      value: 8,
                      message: "8자리 이상 비밀번호를 사용하세요.",
                    },
                    maxLength: {
                      value: 12,
                      message: "12자리 이하 비밀번호를 사용하세요.",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,12}$/,
                      message:
                        "영문 대/소문자, 숫자, 특수문자 포함 8-12자리여야 합니다.",
                    },
                    onChange: (e) => {
                      if (e.target.value) {
                        clearErrors("password"); // 에러 메시지 제거
                      }
                    },
                  })}
                />
              </div>
            </div>
            {errors.pwd && (
              <span className={styles.error_msg}>{errors.pwd.message}</span>
            )}
            <div className={styles.form__actions}>
              <button
                type="button"
                className={styles.btn__submit}
                onClick={() => {
                  navigate("/login");
                }}
              >
                취소
              </button>
              <button
                type="submit"
                className={styles.btn__cancel}
                onClick={() => {
                  setIsTouched(true); // 가입 버튼을 누르면 닉네임 필드 확인
                  trigger("nickname"); // 유효성 검사를 수동으로 트리거
                }}
              >
                가입
              </button>
            </div>
            <p className={styles.login__prompt}>
              아이디가 있다면?{" "}
              <a href="/login" className={styles.login_prompt__link}>
                로그인
              </a>
            </p>

            {/* {signupStatus.isLoading && <p>회원가입 중...</p>}
            {signupStatus.error && <p>{signupStatus.error}</p>} */}
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
