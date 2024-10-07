import { useForm } from 'react-hook-form'
import styles from './RegisterPage.module.scss';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ mode: 'onChange' })
  // const dispatch = useDispatch();

  const onSubmit = ({ email, password, name }) => {

  }

  const userEmail = {
    required: "필수 필드입니다."

  }
  const userName = {
    required: "필수 필드입니다."
  }
  const userPassword = {
    required: '필수 필드입니다.',
    minLength: {
      value: 6,
      message: "최소 6자입니다."
    }
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
              <input type='text' id='nickname' className={styles.form__group__input__box} />
              <button type='button' className={styles.btn__check}>중복확인</button>
            </div>
          </div>
          <div className={styles.form__group}>
            <label htmlFor='email' className={styles.form__group__label}>이메일</label>
            <div className =  {styles.form__group__input__noBtn}>
            <input type='email' id='email' className={styles.form__group__input__box} />
            </div>
          </div>
          <div className={styles.form__group}>
            <label htmlFor='password' className={styles.form__group__label}>비밀번호</label>
            <div className =  {styles.form__group__input__noBtn}>
            <input type='password' id='password' className={styles.form__group__input__box} placeholder='영문 대/소문자,숫자, 특수문자 포함 8-12자리' />
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