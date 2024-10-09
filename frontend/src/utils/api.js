import { signupState } from "../state/authState.js";
import { useSetRecoilState } from "recoil";
import axiosInstance from "./axios.js";
import axios from "axios";

export const useSignup = () => {
  const setSignupState = useSetRecoilState(signupState);

  const signup = (userData) => {
    setSignupState({ isLoading: true, error: null, success: false });

    console.log("api 요청");
    const config = {
      method: "post",
      url: "http://localhost:4000/register",
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config, {
      name: "김희연",
      nickname: "test",
      email: "annie04056@gmail.com",
      pwd: "test2test@",
    })
      .then((response) => {
        console.log("요청완료");
        setSignupState({ isLoading: false, error: null, success: true });
        return response.data; // 성공적으로 회원가입한 경우 데이터 반환
      })
      .catch((error) => {
        console.log(error);
        setSignupState({
          isLoading: false,
          error: error.response?.data?.message || "회원가입 실패",
          success: false,
        });
        throw error; // 에러 발생 시 에러를 던짐
      });

    // try {

    //   // const response = await axios.post(
    //   //   "http://localhost:4000/register",
    //   //   userData
    //   // ); // 회원가입 요청
    //   // console.log("요청완료");
    //   // setSignupState({ isLoading: false, error: null, success: true });
    //   // return response.data; // 성공적으로 회원가입한 경우 데이터 반환
    // } catch (error) {

    // }
  };

  return { signup };
};
