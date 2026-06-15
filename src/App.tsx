import { useQuery } from "@tanstack/react-query";
import { Routes } from "react-router-dom";
import { getData } from "./services/appApi";
import EmployeeForm from "./features/employees/EmployeeForm";
import { useState } from "react";

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
    <h2 onClick={() => setCoworkerWindow(true)}>aa</h2>
    <h3>sadasd</h3>
    {coworkerWindow && <EmployeeForm setCoworkerWindow={setCoworkerWindow} />} 
      <Routes></Routes>
     
    </>
  );
};

export default App;
