import { Outlet, useLocation } from "react-router";
import Navbar from "../header/navbar";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      {!isLoginPage && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Layout;
