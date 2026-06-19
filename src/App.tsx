import { useQuery } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { getData } from "./services/appApi";
import EmployeeForm from "./features/employees/EmployeeForm";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";

const App = () => {
  const {
    error,
    isPending,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getData("tasks"),
  });

  const [coworkerWindow, setCoworkerWindow] = useState(false)

 

  if (isPending) return "Loading...";
  if (error) return "An error has occurred " + error.message;

  return (
    <>
    <Header setCoworkerWindow={setCoworkerWindow} />
    {coworkerWindow && <EmployeeForm setCoworkerWindow={setCoworkerWindow} />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create+task" element={<CreateTask />} />
        <Route path="/details/:id" element={<TaskDetails />} />
      </Routes>
     
    </>
  );
};

export default App;
