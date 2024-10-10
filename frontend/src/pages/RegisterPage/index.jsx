import { useForm } from "react-hook-form";
import styles from "./RegisterPage.module.scss";
import { useState } from "react";
import { useSignup } from "../../utils/api"; // API 요청 로직 import
import { useRecoilValue } from "recoil";
import { signupState } from "../../state/authState";
import { useNavigate } from "react-router-dom"; // useHistory import

const RegisterPage = () => {
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false); // 사용자가 필드를 수정했거나 포커스 여부 관리
  const { signup } = useSignup();
  const signupStatus = useRecoilValue(signupState); // Recoil 상태 가져오기
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      await signup(data);

      reset();
      // navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const {
    register, //input 값을 입력할 때 해당 값을 저장할 변수 이름 정해주는 함수
    handleSubmit, // submit 버튼을 눌렀을 때 form의 전체적인 데이터 처리를 해주는 함수
    formState: { isSubmitted, errors },
    getValues,
    clearErrors,
    reset,
    trigger,
  } = useForm();

  /**
   * formState : form이 현재 어떤 상태인지 알려주는 속성 - 여러번 클릭하면 오류 발생 위험 있음
   * isSubmitted : 제출된 상태
   * isSubmitting :
   * errors : 입력값에 맞는 오류 내용
   */

  const checkDuplicate = async () => {
    const nickname = getValues("nickname");
    const response = await fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname }),
    });

    const result = await response.json();
    if (result.isDuplicate) {
      setDuplicateMessage("중복된 닉네임입니다.");
    } else {
      setDuplicateMessage("중복된 닉네임이 아닙니다.");
    }
  };

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
                      setIsTouched(true);
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
                  onClick={checkDuplicate}
                >
                  중복확인
                </button>
              </div>
            </div>
            {(!isTouched || errors.nickname) && isSubmitted && (
              <span className={styles.error_msg}>
                {errors.nickname.message}
              </span>
            )}
            {duplicateMessage && (
              <span className={styles.error_msg}>{duplicateMessage}</span>
            )}
            <div className={styles.form__group}>
              <label htmlFor="email" className={styles.form__group__label}>
                이메일
              </label>
              <div className={styles.form__group__input__noBtn}>
                <input
                  type="email"
                  id="email"
                  className={styles.form__group__input__box}
                  // {
                  //   /*
                  //     form이 제출된 상태일 때 error가 있는지 없는지 확인해주고
                  //     만약 에러 있으면 message에 정의된 경고문이 보여짐
                  //    */
                  // }

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
              </div>
            </div>
            {errors.email && (
              <span className={styles.error_msg}>{errors.email.message}</span>
            )}
            <div className={styles.form__group}>
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
            {errors.password && (
              <span className={styles.error_msg}>
                {errors.password.message}
              </span>
            )}
            <div className={styles.form__actions}>
              <button type="button" className={styles.btn__submit}>
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

            {signupStatus.isLoading && <p>회원가입 중...</p>}
            {signupStatus.error && <p>{signupStatus.error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
