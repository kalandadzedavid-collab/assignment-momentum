import { useQuery } from "@tanstack/react-query";
import { getData } from "../services/appApi";
import type { departments, priorities, employees } from "../types/types";
import type { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";

type FilterSectionProps = {
  register: UseFormRegister<Record<string, unknown>>;
  handleSubmit: UseFormHandleSubmit<Record<string, unknown>>;
  handleDepartFilter: (data: unknown) => void;
  showFilts: number | null;
  setShowFilts: (v: number | null) => void;
  handlePriorityFilter: (data: unknown) => void;
  handleEmployeeFilter: (data: unknown) => void;
};

const FilterSection = ({
  register,
  handleSubmit,
  handleDepartFilter,
  showFilts,
  setShowFilts,
  handlePriorityFilter,
  handleEmployeeFilter,
}: FilterSectionProps) => {
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("departments"),
  });

  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: () => getData("priorities"),
  });

  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getData("employees"),
  });

  console.log(employees);

  return (
    <section className="relative mb-19.75 px-3 py-3 inline-flex gap-11.25 rounded-[10px] outline outline-zinc-200">
      <div>
        <button
          onClick={() => {
            if (showFilts == 1) {
              setShowFilts(null);
            } else {
              setShowFilts(1);
            }
          }}
          className="cursor-pointer flex gap-2 items-center text-neutral-950
text-base
font-normal"
        >
          დეპარტამენტი
          <img src="/icons/dropdown.svg" alt="dropdown" />
        </button>

        {showFilts == 1 && (
          <div className="bg-white left-0 top-15 absolute rounded-[10px] px-7.5 py-5 outline-[0.50px] outline-violet-600">
            <form
              className="min-w-50 flex flex-col"
              onSubmit={handleSubmit(handleDepartFilter)}
            >
              {departments &&
                departments.map((depart: departments) => {
                  return (
                    <label
                      className="flex gap-3 items-center"
                      key={depart.id}
                      htmlFor={depart.name}
                    >
                      <input
                        {...register("departFilt")}
                        type="checkbox"
                        value={depart.id}
                        id={depart.name}
                      />
                      <span>{depart.name}</span>
                    </label>
                  );
                })}
              <button
                className="cursor-pointer self-end mt-5 px-5 py-2 bg-violet-600 rounded-[20px] text-white
text-base
font-normal"
                type="submit"
              >
                არჩევა
              </button>
            </form>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => {
            if (showFilts == 2) {
              setShowFilts(null);
            } else {
              setShowFilts(2);
            }
          }}
          className="cursor-pointer flex gap-2 items-center text-neutral-950
text-base
font-normal"
        >
          პრიორიტეტი
          <img src="/icons/dropdown.svg" alt="dropdown" />
        </button>

        {showFilts == 2 && (
          <div className="bg-white left-0 top-15 absolute rounded-[10px] px-7.5 py-5 outline-[0.50px] outline-violet-600">
            <form
              className="min-w-50 flex flex-col"
              onSubmit={handleSubmit(handlePriorityFilter)}
            >
              {priorities &&
                priorities.map((priority: priorities) => {
                  return (
                    <label
                      className="flex gap-3 items-center"
                      key={priority.id}
                      htmlFor={priority.name}
                    >
                      <input
                        {...register("priorityFilt")}
                        type="checkbox"
                        value={priority.id}
                        id={priority.name}
                      />
                      <span>{priority.name}</span>
                    </label>
                  );
                })}
              <button
                className="cursor-pointer self-end mt-5 px-5 py-2 bg-violet-600 rounded-[20px] text-white
text-base
font-normal"
                type="submit"
              >
                არჩევა
              </button>
            </form>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => {
            if (showFilts == 3) {
              setShowFilts(null);
            } else {
              setShowFilts(3);
            }
          }}
          className="cursor-pointer flex gap-2 items-center text-neutral-950
text-base
font-normal"
        >
          თანამშრომელი
          <img src="/icons/dropdown.svg" alt="dropdown" />
        </button>

        {showFilts == 3 && (
          <div className="bg-white left-0 top-15 absolute rounded-[10px] px-7.5 py-5 outline-[0.50px] outline-violet-600">
            <form
              className="min-w-50 flex flex-col"
              onSubmit={handleSubmit(handleEmployeeFilter)}
            >
              {employees &&
                employees.map((employee: employees) => {
                  return (
                    <label
                      className="flex gap-3 items-center"
                      key={employee.id}
                      htmlFor={employee.name}
                    >
                      <input
                        {...register("employeeFilt")}
                        type="checkbox"
                        value={employee.id}
                        id={employee.name}
                      />
                      <span>
                        {employee.name} {employee.surname}
                      </span>
                    </label>
                  );
                })}
              <button
                className="cursor-pointer self-end mt-5 px-5 py-2 bg-violet-600 rounded-[20px] text-white
text-base
font-normal"
                type="submit"
              >
                არჩევა
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterSection;
