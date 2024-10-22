import "./index.css";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import BoardDetailPage from "./pages/BoardDetailPage/BoardDetailPage";
import BoardRewritePage from "./pages/BoardRewritePage";
import BoardEditPage from "./pages/BoardEditPage";
import CommonHeader from "./components/header/header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { RecoilRoot, useRecoilValue } from "recoil"; // Import RecoilRoot
import { CookiesProvider } from "react-cookie";
import React from "react";
import { signinState } from "./state/authState";
function Layout() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ToastContainer
        position="top-center"
        theme="light"
        autoClose={2000}
        closeOnClick
      />
      <header
        style={{
          zIndex: "2",
          height: "100px",
          backgroundColor: "#6248FF",
          color: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            position: "fixed",
            backgroundColor: "#6248FF",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CommonHeader />
        </div>
      </header>
      {/* <Navbar /> */}
      <main className="max-w-7xl mx-auto my-20">
        <Outlet />
      </main>
    </div>
  );
}
function PrivateRoute({ children, name }) {
  const signin = useRecoilValue(signinState);
  if (signin.success) {
    console.log("signinsuccess");
    if (name === "Register" || name === "login") {
      // 로그인 상태에서 로그인 또는 등록 페이지에 접근할 경우
      console.log("/posts");
      return <Navigate to="/posts" />; // /posts로 리다이렉트
    }
    console.log("/children");
    // 로그인 상태에서 다른 컴포넌트 렌더링
    return children;
  } else if (name === "login" || name === "Register") {
    // 로그아웃 상태에서 로그인 또는 등록 페이지에 접근할 경우
    console.log("LoginPage");
    return name === "login" ? <LoginPage /> : <RegisterPage />;
  } else {
    // 로그아웃 상태에서 다른 컴포넌트 접근 시 login 으로 이동
    console.log("로그인하지 않은 사용자");
    toast.error("로그인 후 사용하실 수 있습니다."); // Toast 알림 추가
    return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <CookiesProvider>
      <RecoilRoot>
        <ToastContainer
          position="top-center"
          theme="light"
          autoClose={2000}
          closeOnClick
        />
        <Routes>
          <Route
            path="/"
            element={<PrivateRoute name="Register"></PrivateRoute>}
          />
          <Route
            path="/login"
            element={<PrivateRoute name="login"></PrivateRoute>}
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<BoardPage />} />
            <Route path="/posts/detail/:postId" element={<BoardDetailPage />} />
            <Route
              path="/posts/edit"
              element={<BoardEditPage isEditMode={false} />}
            />
            <Route
              path="/posts/detail/:postId/edit"
              element={<BoardRewritePage isEditMode={true} />}
            />
          </Route>
        </Routes>
      </RecoilRoot>
    </CookiesProvider>
  );
}

export default App;
