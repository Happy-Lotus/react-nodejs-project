import { useForm } from "react-hook-form";
import styles from "./Verify_Email.module.scss";

const Verify_Email = () => {
  const onSubmit = (data) => {
    data.preventDefault();
    const form = data.target;
    const formData = new FormData(form);
    fetch("/register", { method: "POST", body: formData });
  };

  const {
    register, //input 값을 입력할 때 해당 값을 저장할 변수 이름 정해주는 함수
    handleSubmit, // submit 버튼을 눌렀을 때 form의 전체적인 데이터 처리를 해주는 함수
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: onSubmit });

  /**
   * formState : form이 현재 어떤 상태인지 알려주는 속성 - 여러번 클릭하면 오류 발생 위험 있음
   * isSubmitted : 제출된 상태
   * isSubmitting :
   * errors : 입력값에 맞는 오류 내용
   */

  return (
    <div className={styles.background__color__container}>
      <section className={styles.signup__container}>
        <div className={styles.signup__box}>
          <h1 className={styles.signup__box__tile}>이메일 인증</h1>
          <form
            className={styles.signup__box__form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.form__group}>
              <div className={styles.form__group__input__noBtn}>
                <input
                  type="text"
                  id="verifyNumber"
                  className={styles.form__group__input__box}
                  placeholder="인증 번호를 입력해주세요."
                />
              </div>
            </div>

            <div className={styles.form__actions}>
              <button type="submit" className={styles.btn__cancel}>
                가입
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Verify_Email;
