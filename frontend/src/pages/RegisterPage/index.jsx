import { useForm } from 'react-hook-form'
import styles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const {
    register, //input 값을 입력할 때 해당 값을 저장할 변수 이름 정해주는 함수
    handleSubmit, // submit 버튼을 눌렀을 때 form의 전체적인 데이터 처리를 해주는 함수 
    formState: { 
      isSubmitting,
      isSubmitted,
      errors }
  } = useForm({ mode: onSubmit })

  /**
   * formState : form이 현재 어떤 상태인지 알려주는 속성 - 여러번 클릭하면 오류 발생 위험 있음
   * isSubmitted : 제출된 상태
   * isSubmitting : 
   * errors : 입력값에 맞는 오류 내용
   */

  const onSubmit = (data) => {
    data.preventDefault();
    const form = data.target;
    const formData = new FormData(form);
    fetch('/register',{method:"POST",body:formData})

  }

  return (
    <div className={styles.background__color__container}>
    <section className={styles.signup__container}>
      <div className={styles.signup__box}>
        <h1 className={styles.signup__box__tile}>Signup</h1>
        <form className={styles.signup__box__form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.form__group}>
            <label htmlFor='name' className={styles.form__group__label}>이름</label>
            <div className = {styles.form__group__input__noBtn}>
              <input type='text' id='name' className={styles.form__group__input__box} />
            </div>
          </div>
          <div className={styles.form__group}>
            <label htmlFor='nickname' className={styles.form__group__label}>닉네임</label>
            <div className={styles.form__group__input}>
              <input type='text' id='nickname' className={styles.form__group__input__box}
              aria-invalid={isSubmitted ? (errors.nickname ? "true" : "false") : undefined}
              {...register("nickname",{required: "닉네임은 필수입력입니다."})} />
              <button type='button' className={styles.btn__check}>중복확인</button>
            </div>
            {errors.nickname && (
              <span className = {styles.error_msg}>{errors.nickname.message}</span>
            )}
          </div>
          <div className={styles.form__group}>
            <label htmlFor='email' className={styles.form__group__label}>이메일</label>
            <div className =  {styles.form__group__input__noBtn}>
            <input type='email' id='email' className={styles.form__group__input__box} 
              // {
              //   /*
              //     form이 제출된 상태일 때 error가 있는지 없는지 확인해주고
              //     만약 에러 있으면 message에 정의된 경고문이 보여짐
              //    */
              // }

              aria-invalid={
                isSubmitted ? (errors.email ? "true" : "false") : undefined
              }
              {...register("email",{
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식에 맞지 않습니다."}
              })
            }
            />
            {errors.email && (
              <span className={styles.error_msg}>{errors.email.message}</span>
            )}
            </div>
          </div>
          <div className={styles.form__group}>
            <label htmlFor='password' className={styles.form__group__label}>비밀번호</label>
            <div className =  {styles.form__group__input__noBtn}>
            <input type='password' id='password' className={styles.form__group__input__box} placeholder='영문 대/소문자,숫자, 특수문자 포함 8-12자리'
            {...register("password",{
              required: "비밀번호는 필수 입력입니다.",
              minLength: {
                value: 8,
                message: "8자리 이상 비밀번호를 사용하세요."
              },
              maxLength: {
                value: 12,
                message: "12자리 이하 비밀번호를 사용하세요."
              },
            })} 
            />
            {errors.password && (
              <span className={styles.error_msg}>{errors.password.message}</span>
            )}
          </div>
          </div>
          <div className={styles.form__actions}>
            <button type='button' className={styles.btn__submit}>취소</button>
            <button type='submit' className={styles.btn__cancel}>가입</button>
          </div>
          <p className={styles.login__prompt}>
            아이디가 있다면?{' '}
            <a href='/login' className={styles.login_prompt__link}>로그인</a>
          </p>
        </form>
      </div>
    </section>
    </div>
  )
}

export default RegisterPage