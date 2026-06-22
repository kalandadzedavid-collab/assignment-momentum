import { useQuery } from "@tanstack/react-query";
import Task from "../components/Task";
import type { postTask } from "../types/types";
import { getData } from "../services/appApi";
import StatusButton from "../components/StatusButton";
import FilterSection from "../components/FilterSection";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";

const Home = () => {
  const { data: tasks } = useQuery<postTask[]>({
    queryKey: ["tasks"],
    queryFn: () => getData("tasks"),
  });

  // console.log(tasks);

  const { register, handleSubmit } = useForm();

  const [departFilt, setDepartFilt] = useState<string[]>([]);
  const [priorityFilt, setPriorityFilt] = useState<string[]>([]);
  const [showFilts, setShowFilts] = useState<number | null>(null);
  const [employeeFilt, setEmployeeFilt] = useState<string[]>([]);

  function handleDepartFilter(data: { departFilt: string[] }) {
    setDepartFilt(data.departFilt);
    setShowFilts(null);
  }

  function handlePriorityFilter(data: { priorityFilt: string[] }) {
    setPriorityFilt(data.priorityFilt);
    setShowFilts(null);
  }

  function handleEmployeeFilter(data: { employeeFilt: string[] }) {
    setEmployeeFilt(data.employeeFilt);
    setShowFilts(null);
  }

  // console.log(departFilt);
  // console.log(priorityFilt)
  console.log(employeeFilt);
  console.log(tasks);

  const filteredTasks = useMemo(() => {
    return (tasks ?? []).filter((task: postTask) => {
      // 1. Department Filter
      const matchesDepartment =
        departFilt.length > 0
          ? departFilt.includes(task.department.id.toString())
          : true;

      // 2. Priority Filter
      const matchesPriority =
        priorityFilt.length > 0
          ? priorityFilt.includes(task.priority.id.toString())
          : true;

      // 3. Employee Filter
      const matchesEmployee =
        employeeFilt.length > 0
          ? task.employee
            ? employeeFilt.includes(task.employee.id.toString())
            : false
          : true;

      // The task must satisfy ALL THREE active filter conditions
      return matchesDepartment && matchesPriority && matchesEmployee;
    });
  }, [tasks, departFilt, priorityFilt, employeeFilt]); // Added employeeFilt to dependencies

  console.log(filteredTasks);

  return (
    <main className="px-30">
      <h1
        className="mt-10 mb-12.5 text-neutral-800
text-2xl
font-semibold"
      >
        დავალებების გვერდი
      </h1>
      <FilterSection
        handleEmployeeFilter={handleEmployeeFilter}
        handlePriorityFilter={handlePriorityFilter}
        showFilts={showFilts}
        setShowFilts={setShowFilts}
        handleDepartFilter={handleDepartFilter}
        register={register}
        handleSubmit={handleSubmit}
      />
      <div className="flex justify-between">
        <section className="flex flex-col gap-7.5">
          <StatusButton status={"დასაწყები"} color={`bg-[#F7BC30]`} />

          {filteredTasks
            .filter((task: { status: { name: string } }) => {
              return task?.status?.name == "დასაწყები";
            })
            .map((filt) => {
              return (
                <Task
                  key={filt.id}
                  data={filt}
                  outline_col={`outline-[#F7BC30]`}
                />
              );
            })}
        </section>

        <section className="flex flex-col gap-7.5">
          <StatusButton status={"პროგრესში"} color={`bg-[#FB5607]`} />

          {filteredTasks
            .filter((task: { status: { name: string } }) => {
              return task?.status?.name == "პროგრესში";
            })
            .map((filt) => (
              <Task
                key={filt.id}
                data={filt}
                outline_col={`outline-[#FB5607]`}
              />
            ))}
        </section>

        <section className="flex flex-col gap-7.5">
          <StatusButton status={"მზად ტესტირებისთვის"} color={`bg-[#FF006E]`} />
          {filteredTasks
            .filter((task) => task?.status?.name == "მზად ტესტირებისთვის")
            .map((filt) => (
              <Task
                key={filt.id}
                data={filt}
                outline_col={`outline-[#FF2080]`}
              />
            ))}
        </section>

        <section className="flex flex-col gap-7.5">
          <StatusButton status={"დასრულებული"} color={`bg-[#3A86FF]`} />

          {filteredTasks
            .filter((task: { status: { name: string } }) => {
              return task?.status?.name == "დასრულებული";
            })
            .map((filt) => (
              <Task
                key={filt.id}
                data={filt}
                outline_col={`outline-[#3A86FF]`}
              />
            ))}
        </section>
      </div>
    </main>
  );
};

export default Home;
