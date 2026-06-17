import { useQuery } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { getData } from "./services/appApi";
import EmployeeForm from "./features/employees/EmployeeForm";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";

const App = () => {
  const {
    data: statuses,
    error,
    isPending,
  } = useQuery({
    queryKey: ["statuses"],
    queryFn: () => getData("statuses"),
  });

  const [coworkerWindow, setCoworkerWindow] = useState(false)

  console.log(statuses);

  if (isPending) return "Loading...";
  if (error) return "An error has occurred " + error.message;

  return (
    <>
    <Header setCoworkerWindow={setCoworkerWindow} />
    {coworkerWindow && <EmployeeForm setCoworkerWindow={setCoworkerWindow} />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create+task" element={<CreateTask />} />
      </Routes>
     
    </>
  );
};

export default App;
