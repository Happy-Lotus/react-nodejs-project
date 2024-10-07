import { useForm } from 'react-hook-form'
import styles from './LoginPage.module.scss';

const LoginPage = () => {
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
        <h1 className={styles.signup__box__tile}>Login</h1>
        <form className={styles.signup__box__form} onSubmit={handleSubmit(onSubmit)}>
        
          <div className={styles.form__group}>
            <input type='email' id='email' className={styles.form__group__input} placeholder='이메일 입력'/> {/**'form-input */}
            <input type='password' id='password' className={styles.form__group__input} placeholder='비밀번호 입력' />
          </div>
          {
            
          }
          <div className={styles.form__actions}>
            <button type='submit' className={styles.btn__submit}>로그인</button>
          </div>
          <p className={styles.login__prompt}>
            <a href='/' className={styles.login_prompt__link}>회원가입</a>
          </p>
        </form>
      </div>
    </section>
    </div>
  )
}

export default LoginPage