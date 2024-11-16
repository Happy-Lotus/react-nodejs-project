import { signupState, signinState, userState } from "../state/authState.js";
import { useSetRecoilState } from "recoil";
import axiosInstance from "./axios.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const api_url = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true;

//회원가입
export const useSignup = () => {
  const setSignupState = useSetRecoilState(signupState);

  const signup = async (userData, isVerified) => {
    console.log("api 요청");
    const config = {
      method: "post",
      url: `${api_url}/register`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: userData.name,
        nickname: userData.nickname,
        email: userData.email,
        pwd: userData.pwd,
        isVerified: isVerified,
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
  const signin = async (userData) => {
    console.log("sign in api 요청");
    const config = {
      method: "post",
      url: `${api_url}/login`,
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {
        email: userData.email,
        pwd: userData.pwd,
      },
    };
    try {
      const response = await axios(config);
      console.log(response);
      return response;
    } catch (error) {
      throw error; // 에러 발생 시 에러를 던짐
    }
  };
  return { signin };
};

export const fetchPosts = async () => {
  try {
    const config = {
      method: "get",
      url: `${api_url}/posts`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    console.log("posts api 요청중");
    const response = await axios(config); // API 호출
    console.log(response);
    const transformedPosts = response.data.postData.map((item) => ({
      id: item.post.boardid, // 게시물 ID
      title: item.post.title, // 제목
      writer: item.post.writer, // 작성자
      regdate: item.post.regdate.split(" ")[0], // 작성일
      thumbnail: item.post.thumbnail, // 썸네일
      files: item.files, // 파일
    }));
    console.log("요청 완료");
    return transformedPosts; // 데이터 반환
  } catch (error) {}
};

export const useFetchPostDetail = () => {
  const setSigninState = useSetRecoilState(signinState);
  const navigate = useNavigate();

  const fetchPostDetail = async (postId) => {
    try {
      console.log("fetchPostDetail");
      const response = await axios.get(`${api_url}/posts/detail/${postId}`); // API 호출
      console.log("fetchPostDetail");
      console.log(response);

      const transformedPost = response.data.postData;
      return transformedPost; // 데이터 반환
    } catch (error) {
      if (error.response.data.statusCode === 401) {
        setSigninState({
          isLoading: false,
          error: error.response?.data?.message || "다시 로그인하세요",
          success: false,
        });
        setTimeout(() => {
          navigate("/login"); // 로그인 페이지로 리디렉션
        }, 100); // 잠시 대기 후 리디렉션
      }
    }
  };
  return { fetchPostDetail };
};

export const checkNickname = async (nickname) => {
  try {
    console.log(api_url);
    const config = {
      method: "post",
      url: `${api_url}/checkNickname`,
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {
        nickname: nickname,
      },
    };

    const response = await axios(config);
    console.log("frontend response 결과");
    console.log(response.data.length);
    return response.data.length > 0;
  } catch (error) {}
};

export const useLogout = () => {
  const setSigninState = useSetRecoilState(signinState);
  const setUserState = useSetRecoilState(userState);
  const navigate = useNavigate();
  const userLogout = async () => {
    try {
      const config = {
        url: `${api_url}/logout`,
        method: "post",
        headers: {
          "Content-Type": "application/json",
          withCredentials: true,
        },
        data: {},
      };

      const response = await axios(config);
      if (response.status === 204) {
        setSigninState({ isLoading: false, error: null, success: false });
        setUserState({ nickname: "" });
        alert("로그아웃되었습니다.");
      }
    } catch (error) {
      setSigninState({ isLoading: false, error: null, success: false });
      setUserState({ nickname: "" });
      alert("로그아웃 중 오류가 발생했습니다.");
    } finally {
      navigate("/login"); // 로그인 페이지로 리디렉션
    }
  };
  return { userLogout };
};

export const generateCode = async (email) => {
  console.log("email", email);
  try {
    const config = {
      url: `${api_url}/generateCode`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {
        email: email,
      },
    };

    const response = await axios(config);
    // console.log(response);
    return response;
  } catch (error) {
    if (error.response.status === 409) {
      alert(error.response.data.message);
    }
  }
};

export const verifyCode = async (email, code) => {
  try {
    const config = {
      url: `${api_url}/verify-email`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
      data: {
        email: email,
        code: code,
      },
    };

    const response = await axios(config);
    console.log(response);
    return response;
  } catch (error) {}
};

export const registerPost = async (formData) => {
  try {
    const config = {
      url: `${api_url}/posts/edit`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        withCredentials: true,
      },
      body: formData,
    };
    for (const key of formData.keys()) {
      console.log(key);
    }
    for (const value of formData.values()) {
      console.log(value);
    }
    console.log(formData);
    const response = await axios.post(`${api_url}/posts/edit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        withCredentials: true,
      },
    });
    console.log(response);
    return response;
  } catch (error) {}
};

export const updatePost = async (postid, formData) => {
  try {
    const config = {
      url: `${api_url}/posts/detail/${postid}`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        withCredentials: true,
      },
      body: formData,
    };

    console.log(formData);
    const response = await axios.post(
      `${api_url}/posts/detail/${postid}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          withCredentials: true,
        },
      }
    );
    console.log(response);
    return response;
  } catch (error) {}
};

export const downloadFile = async (postid, filename) => {
  try {
    const config = {
      method: "get",
      url: `${api_url}/posts/${postid}/file/${filename}`,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
      withCredentials: true,
    };
    const response = await axios(config);
    console.log(response.status);
    return response;
  } catch (error) {
    console.error("Error downloading file:", error); // Added error logging
  }
};

export const postDelete = async (postid) => {
  try {
    const config = {
      method: "delete",
      url: `${api_url}/posts/${postid}`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios(config);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error deleteing file:", error); // Added error logging
  }
};

export const useReadOption = () => {
  const setSigninState = useSetRecoilState(signinState);
  const setUserState = useSetRecoilState(userState);
  const navigate = useNavigate();

  const readOption = async (option = "", content, page, perPage = 5) => {
    try {
      const config = {
        method: "get",
        url: `${api_url}/posts?option=${option}&content=${content}&page=${page}&perPage=${perPage}`,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      console.log("api요청");

      const response = await axios(config);
      return response.data;
    } catch (error) {
      if (error.response.data.statusCode === 401) {
        alert("재로그인하세요."); // 오류 메시지 표시
        setSigninState({ isLoading: false, error: null, success: false }); // 로그인 상태 업데이트
        setUserState({ nickname: "" }); // 사용자 상태 초기화
        navigate("/login"); // 로그인 페이지로 리디렉션
      }
      throw error;
    }
  };
  return { readOption };
};

export const deleteFiles = async (postData) => {
  try {
    console.log("파일 삭제 api");
    const config = {
      method: "post",
      url: "http://localhost:4000/posts/cancel",
      headers: {
        "Content-Type": "application/json",
      },

      data: postData,
    };
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("Error deleteFiles", error);
    throw error;
  }
};
