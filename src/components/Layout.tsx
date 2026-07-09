import { useState } from "react";
import EmployeeForm from "../features/employees/EmployeeForm";
import Header from "./Header";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  const [coworkerWindow, setCoworkerWindow] = useState(false);

  const loginInfo = localStorage.getItem("login");
  if (!loginInfo) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Header setCoworkerWindow={setCoworkerWindow} />
      {coworkerWindow && <EmployeeForm setCoworkerWindow={setCoworkerWindow} />}

      <Outlet />

      <Footer />
    </div>
  );
};

export default Layout;
