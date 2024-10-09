import "./index.css";
import { Route, Routes, Outlet } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import Verify_Email from "./pages/VerifyEmailPage";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import Navbar from "./layout/Navbar/Navbar";
import Footer from "./components/footer/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { RecoilRoot } from "recoil"; // Import RecoilRoot
function Layout() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <ToastContainer
        position="bottom-right"
        theme="light"
        pauseOnHover
        autoClose={1500}
      />

      {/* <Navbar /> */}
      <main className="mb-auto w-10/12 max-w-7xl mx-auto">
        <Outlet />
      </main>
      {/* <Footer /> */}
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
          {/*로그인 여부와 상관없이 갈 수 있는 경로*/}
          {/* <Route index element={<RegisterPage />} /> */}
          {/* <Route index element={<PostEditor />} /> */}
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
