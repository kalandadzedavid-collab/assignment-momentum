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
    // Base layout canvas setup shifting cleanly between light canvas tone and premium deep ink dark mode
    <div className="flex flex-col min-h-screen justify-between bg-[#FAF7FE] dark:bg-[#1E202B] transition-colors duration-300">
      <Header setCoworkerWindow={setCoworkerWindow} />

      {coworkerWindow && <EmployeeForm setCoworkerWindow={setCoworkerWindow} />}

      {/* Main app viewport view injection */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
