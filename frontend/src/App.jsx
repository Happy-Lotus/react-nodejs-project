import "./index.css";
import { Route, Routes, Outlet } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage"
import BoardPage from "./pages/BoardPage"
import Navbar from "./layout/Navbar/Navbar";
import Footer from "./layout/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

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
      <main className="mb-auto w-10/12 max-w-4xl mx-auto">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route path="/posts" element={<BoardPage />} />
        {/*로그인 여부와 상관없이 갈 수 있는 경로*/}
        {/* <Route index element={<RegisterPage />} /> */}
        {/* <Route index element={<PostEditor />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
