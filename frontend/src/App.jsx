import "./index.css";
import { Route, Routes, Outlet } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./layout/Navbar/Navbar";
import Footer from "./layout/Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import PostEditor from "./pages/PostEditor";

function Layout() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <ToastContainer
        position="bottom-right"
        theme="light"
        pauseOnHover
        autoClose={1500}
      />

      <Navbar />
      <main className="mb-auto w-10/12 max-w-4xl mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/*로그인 여부와 상관없이 갈 수 있는 경로*/}
        {/* <Route index element={<RegisterPage />} /> */}
        <Route index element={<PostEditor />} />
      </Route>
    </Routes>
  );
}

export default App;
