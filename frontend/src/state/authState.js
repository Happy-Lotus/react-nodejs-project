import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const signupState = atom({
  key: "signupState", // 고유한 ID
  default: {
    isLoading: false,
    error: null,
    success: false,
  },
});

export const signinState = atom({
  key: "signinState", // 고유한 ID
  default: {
    isLoading: false,
    error: null,
    success: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export const userState = atom({
  key: "userState",
  default: {
    nickname: "",
  },
  effects_UNSTABLE: [persistAtom],
});
