import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";
import { getData } from "./services/appApi";
import { useThemeStore } from "./stores/useThemeStore"; // Import your new theme store
import type { ThemeState } from "./stores/useThemeStore";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import TaskDetails from "./pages/TaskDetails";
import Layout from "./components/Layout";
import Login from "./pages/Login";

const App = () => {
  const initTheme = useThemeStore((state: ThemeState) => state.initTheme);

  // Initialize and persist theme settings on mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const { error, isPending } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getData("tasks"),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred " + error.message;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create+task" element={<CreateTask />} />
          <Route path="/details/:id" element={<TaskDetails />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;