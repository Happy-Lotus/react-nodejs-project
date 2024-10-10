import { signupState, signinState } from "../state/authState.js";
import { useSetRecoilState } from "recoil";
import axiosInstance from "./axios.js";
import axios from "axios";

export const useSignup = () => {
  const setSignupState = useSetRecoilState(signupState);

  const signup = async (userData) => {
    console.log("api 요청");
    const config = {
      method: "post",
      url: "http://localhost:4000/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: "김희연",
        nickname: "test33",
        email: "annie04056@gmail.com",
        pwd: "test2test@",
      },
    };
    try {
      const response = await axios(config);
      console.log("요청완료");
      setSignupState({ isLoading: false, error: null, success: true });
      return response.data; // 성공적으로 회원가입한 경우 데이터 반환
    } catch (error) {
      console.log("요청실패");
      console.log(error);
      setSignupState({
        isLoading: false,
        error: error.response?.data?.message || "회원가입 실패",
        success: false,
      });
      throw error; // 에러 발생 시 에러를 던짐
    }
  };
  return { signup };
};

export const useLogin = () => {
  const setSigninState = useSetRecoilState(signinState);

  const signin = async (userData) => {
    console.log("sign in api 요청");
    const config = {
      method: "post",
      url: "http://localhost:4000/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: userData.email,
        pwd: userData.pwd,
      },
    };
    try {
      const response = await axios(config);
      console.log("요청완료");
      setSigninState({ isLoading: false, error: null, success: true });
      if (response.status === 201) {
        console.log("로그인 완료");
      }
    } catch (error) {
      console.log("요청실패");
      console.log(error);
      setSigninState({
        isLoading: false,
        error: error.response?.data?.message || "회원가입 실패",
        success: false,
      });
      throw error; // 에러 발생 시 에러를 던짐
    }
  };
  return { signin };
};
