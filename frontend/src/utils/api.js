import { signupState, signinState } from "../state/authState.js";
import { useSetRecoilState } from "recoil";
import axiosInstance from "./axios.js";
import axios from "axios";
import { useCookies } from "react-cookie";
axios.defaults.withCredentials = true;

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
        name: userData.name,
        nickname: userData.nickname,
        email: userData.email,
        pwd: userData.pwd,
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
  const [cookies, setCookie] = useCookies(["AccessToken", "RefreshToken"]);

  const signin = async (userData) => {
    console.log("sign in api 요청");
    const config = {
      method: "post",
      url: "http://localhost:4000/login",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {
        email: userData.email,
        pwd: userData.pwd,
      },
      // withCredentials: true,
    };
    try {
      const response = await axios(config);
      setSigninState({ isLoading: false, error: null, success: true });
      console.log(response);
      return response;
    } catch (error) {
      setSigninState({
        isLoading: false,
        error: error.response?.data?.message || "로그인 실패",
        success: false,
      });
      throw error; // 에러 발생 시 에러를 던짐
    }
  };
  return { signin };
};

export const fetchPosts = async () => {
  try {
    const config = {
      method: "get",
      url: "http://localhost:4000/posts",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    console.log("posts api 요청중");
    const response = await axios(config); // API 호출

    const transformedPosts = response.data.map((item) => ({
      id: item.post.boardid, // 게시물 ID
      title: item.post.title, // 제목
      writer: item.post.writer, // 작성자
      regdate: item.post.regdate.split(" ")[0], // 작성일
      thumbnail: item.post.thumbnail, // 썸네일
      files: item.files, // 파일
    }));
    console.log("요청 완료");
    return transformedPosts; // 데이터 반환
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error; // 에러 발생 시 에러 던짐
  }
};

// 게시물 상세 데이터 가져오기
export const fetchPostDetail = async (postId) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/posts/detail/${postId}`
    ); // API 호출
    console.log(response.data.filelist);
    console.log(response.data);

    const transformedPost = response.data.board.map((item, index) => ({
      title: item.title, // 제목
      content: item.content, //내용
      writer: item.writer, // 작성자
      regdate: item.regdate.split(" ")[0], // 작성일
      thumbnail: item.thumbnail, // 썸네일
    }));
    transformedPost.filelist = response.data.filelist;
    return transformedPost; // 데이터 반환
  } catch (error) {
    console.error("Error fetching post detail:", error);
    throw error;
  }
};

export const checkNickname = async (nickname) => {
  try {
    const config = {
      method: "post",
      url: "http://localhost:4000/checkNickname",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {
        nickname: nickname,
      },
    };

    const response = await axios(config);
    console.log(response.data.length > 0);

    return response.data.length > 0;
  } catch (error) {}
};

export const updatePost = async (data) => {
  try {
    const config = {
      method: "post",
      url: "http://localhost:4000/",
      headers: {
        "Content-Type": "multipart/form-data",
        withCredentials: true,
      },
      data: {
        title: data.title,
        content: data.content,
        files: data.files,
      },
    };

    const response = await axios(config);
    return response;
  } catch (error) {}
};

export const userLogout = async () => {
  try {
    const config = {
      url: "http://localhost:4000/logout",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {},
    };

    const response = await axios(config);
    return response;
  } catch (error) {}
};
