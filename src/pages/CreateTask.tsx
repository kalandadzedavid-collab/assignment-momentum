import { useQuery } from "@tanstack/react-query";
import { getData } from "../services/appApi";
import type { priorities } from "../types/types";
import { useMemo, useState } from "react";
import type { departments, employees, statuses } from "../types/types";

const CreateTask = () => {
  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: () => getData("priorities"),
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: () => getData("statuses"),
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("departments"),
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getData("employees"),
  });

  const [selectedPrior, setSelectcedPrior] = useState(1);
  const [selectedDepart, setSelectedDepart] = useState(1);

  console.log(priorities);
  console.log(statuses);
  console.log(departments);
  console.log(employees);
  console.log(selectedDepart);

  const filterWorkers = useMemo(() => {
    if (!employees) return [];

    return employees.filter((employee: employees) => {
      return employee.department_id == selectedDepart;
    });
  }, [selectedDepart, employees]);

  console.log("filtered", filterWorkers);

  return (
    <main className="mt-10 px-30">
      <h1 className="mb-6 text-neutral-800 text-2xl font-semibold">
        შექმენი ახალი დავალება
      </h1>

      <form className="flex flex-col bg-[#FCFBFF] px-13.75 py-16.25">
        <div className="flex justify-between">
          <div className="flex flex-col gap-13.75">
            <label htmlFor="name">
              <p
                className="text-neutral-700
text-base
font-normal"
              >
                სათაური*
              </p>
              <input
                id="name"
                className="w-137.5 p-3.5 bg-white rounded-[5px] outline outline-zinc-200"
                type="text"
              />
              <p
                className="text-gray-500
text-[10px]"
              >
                მინიმუმ 2 სიმბოლო
              </p>
              <p
                className="text-gray-500
text-[10px]"
              >
                მაქსიმუმ 255 სიმბოლო
              </p>
            </label>

            <label htmlFor="description">
              <p
                className="text-neutral-700
text-base
font-normal"
              >
                აღწერა
              </p>
              <textarea
                id="description"
                className="w-137.5 h-32 p-3.5 bg-white rounded-[5px] outline outline-zinc-200"
              />
              <p
                className="text-gray-500
text-[10px]"
              >
                მინიმუმ 2 სიმბოლო
              </p>
              <p
                className="text-gray-500
text-[10px]"
              >
                მაქსიმუმ 255 სიმბოლო
              </p>
            </label>

            <div className="flex gap-10">
              <label htmlFor="priority">
                <p
                  className="text-neutral-700
text-base
font-normal"
                >
                  პრიორიტეტი
                </p>
                <div className="rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-64 h-11">
                  <img
                    src={priorities && priorities[selectedPrior - 1].icon}
                    alt=""
                  />
                  <select
                    onChange={(e) => setSelectcedPrior(+e.target.value)}
                    className="w-full outline-0"
                    id="priority"
                  >
                    {priorities &&
                      priorities.map((priority: priorities) => {
                        return (
                          <option key={priority.id} value={priority.id}>
                            {" "}
                            {priority.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </label>

              <label htmlFor="status">
                <p
                  className="text-neutral-700
text-base
font-normal"
                >
                  სტატუსი
                </p>
                <div className="rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-64 h-11">
                  <select id="status" className="outline-0">
                    {statuses &&
                      statuses.map((item: statuses) => {
                        return <option key={item.id}>{item.name}</option>;
                      })}
                  </select>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <label htmlFor="departments">
              <p
                className="text-neutral-700
text-base
font-normal"
              >
                დეპარტამენტი
              </p>

              <div className="h-13 rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-137.5">
                <select
                  onChange={(e) => setSelectedDepart(+e.target.value)}
                  className="w-full outline-0"
                  id="departments"
                >
                  {departments &&
                    departments.map((depart: departments) => {
                      return (
                        <option value={depart.id} key={depart.id}>
                          {depart.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </label>

            <label htmlFor="worker">
              <p
                className="text-gray-400
text-base
font-normal"
              >
                პასუხისმგებელი თანამშრომელი
              </p>

              <div className="h-13 rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-137.5">
                <select className="w-full outline-0" id="worker">
                  {filterWorkers &&
                    filterWorkers.map((worker: employees) => {
                      return (
                        <option key={worker.id}>
                          {worker.name + " " + worker.surname}
                        </option>
                      );
                    })}
                </select>
              </div>
            </label>
          </div>
        </div>

        <button
          className="self-end px-5 py-2.5 bg-[#8338EC] text-white"
          type="submit"
        >
          დავალების შექმნა
        </button>
      </form>
    </main>
  );
};

export default CreateTask;
