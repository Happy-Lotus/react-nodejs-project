import "./index.css";
import { Route, Routes, Outlet } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import Verify_Email from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import BoardDetailPage from "./pages/BoardDetailPage/BoardDetailPage";
import BoardRewritePage from "./pages/BoardRewritePage";
import BoardEditPage from "./pages/BoardEditPage";
import CommonHeader from "./components/header/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { RecoilRoot } from "recoil"; // Import RecoilRoot
function Layout() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ToastContainer
        position="bottom-right"
        theme="light"
        pauseOnHover
        autoClose={1500}
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

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/verify-email" element={<Verify_Email />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/posts" element={<Layout />}>
          <Route index element={<BoardPage />} />
          <Route path="/posts/detail/:postId" element={<BoardDetailPage />} />
          <Route path="/posts/edit" element={<BoardEditPage />} />
          <Route
            path="/posts/detail/:postId/edit"
            element={<BoardRewritePage />}
          />
          {/*로그인 여부와 상관없이 갈 수 있는 경로*/}
          {/* <Route index element={<RegisterPage />} /> */}
          {/* <Route index element={<PostEditor />} /> */}
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
