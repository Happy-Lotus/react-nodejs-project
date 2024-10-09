import { atom } from "recoil";

export const signupState = atom({
  key: "signupState", // 고유한 ID
  default: {
    isLoading: false,
    error: null,
    success: false,
  },
});
