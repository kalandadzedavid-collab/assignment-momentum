import { useQuery } from "@tanstack/react-query";
import { getData } from "../services/appApi";
import type { departments, priorities, employees } from "../types/types";
import type { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

type FormFields = {
  departFilt: string[];
  priorityFilt: string[];
  employeeFilt: string[];
};

type FilterSectionProps = {
  register: UseFormRegister<FormFields>;
  handleSubmit: UseFormHandleSubmit<FormFields>;
  handleDepartFilter: (data: FormFields) => void;
  showFilts: number | null;
  setShowFilts: (v: number | null) => void;
  handlePriorityFilter: (data: FormFields) => void;
  handleEmployeeFilter: (data: FormFields) => void;
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

  const toggleFilter = (id: number) => {
    setShowFilts(showFilts === id ? null : id);
  };

  const popoverAnimation = {
    initial: { opacity: 0, y: 4, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 4, scale: 0.98 },
    transition: { duration: 0.15, ease: "easeOut" },
  } as const;

  return (
    // Updated container: dynamically shifts from white to modern slate charcoal with matching borders
    <section className="grid grid-cols-1 md:flex md:inline-flex items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto mb-12 p-2 md:p-1.5 md:px-4 bg-white dark:bg-[#222533] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm transition-all duration-300">
      {/* 1. DEPARTMENT FILTER */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleFilter(1)}
          className={`w-full md:w-auto cursor-pointer flex gap-4 items-center justify-between md:justify-start text-xs md:text-sm font-medium px-4 md:px-3 py-3 md:py-2 rounded-xl transition-colors ${
            showFilts === 1
              ? "bg-neutral-100 dark:bg-neutral-800 text-[#8338EC] dark:text-purple-400"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          }`}
        >
          <span>დეპარტამენტი</span>
          <motion.svg
            animate={{ rotate: showFilts === 1 ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 opacity-70 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {showFilts === 1 && (
            <motion.div
              {...popoverAnimation}
              className="bg-white dark:bg-[#2A2D3E] left-0 right-0 md:right-auto md:left-0 top-[calc(100%+6px)] absolute rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-xl z-50 md:min-w-[320px] transition-colors duration-300"
            >
              <form
                className="flex flex-col gap-2.5"
                onSubmit={handleSubmit((data) => {
                  handleDepartFilter(data);
                  setShowFilts(null);
                })}
              >
                <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
                  {departments?.map((depart: departments) => (
                    <label
                      className="flex gap-3 items-center px-2 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer text-sm text-neutral-700 dark:text-neutral-200 transition-colors select-none"
                      key={depart.id}
                      htmlFor={`dept-${depart.id}`}
                    >
                      <input
                        {...register("departFilt")}
                        type="checkbox"
                        value={depart.id}
                        id={`dept-${depart.id}`}
                        className="w-4 h-4 rounded text-[#8338EC] dark:text-purple-500 border-neutral-300 dark:border-neutral-600 dark:bg-[#1E202B] focus:ring-[#8338EC]/20 accent-[#8338EC] cursor-pointer"
                      />
                      <span className="truncate">{depart.name}</span>
                    </label>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#7023db" }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer self-end mt-2 px-5 py-1.5 bg-[#8338EC] rounded-full text-white text-xs font-medium shadow-sm transition-colors"
                  type="submit"
                >
                  არჩევა
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Divider on Mobile */}
      <div className="hidden md:block h-5 w-[1px] bg-neutral-200 dark:bg-neutral-800 self-center transition-colors duration-300" />

      {/* 2. PRIORITY FILTER */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleFilter(2)}
          className={`w-full md:w-auto cursor-pointer flex gap-4 items-center justify-between md:justify-start text-xs md:text-sm font-medium px-4 md:px-3 py-3 md:py-2 rounded-xl transition-colors ${
            showFilts === 2
              ? "bg-neutral-100 dark:bg-neutral-800 text-[#8338EC] dark:text-purple-400"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          }`}
        >
          <span>პრიორიტეტი</span>
          <motion.svg
            animate={{ rotate: showFilts === 2 ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 opacity-70 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {showFilts === 2 && (
            <motion.div
              {...popoverAnimation}
              className="bg-white dark:bg-[#2A2D3E] left-0 right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 top-[calc(100%+6px)] absolute rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-xl z-50 md:min-w-[200px] transition-colors duration-300"
            >
              <form
                className="flex flex-col gap-2.5"
                onSubmit={handleSubmit((data) => {
                  handlePriorityFilter(data);
                  setShowFilts(null);
                })}
              >
                <div className="flex flex-col gap-1">
                  {priorities?.map((priority: priorities) => (
                    <label
                      className="flex gap-3 items-center px-2 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer text-sm text-neutral-700 dark:text-neutral-200 transition-colors select-none"
                      key={priority.id}
                      htmlFor={`priority-${priority.id}`}
                    >
                      <input
                        {...register("priorityFilt")}
                        type="checkbox"
                        value={priority.id}
                        id={`priority-${priority.id}`}
                        className="w-4 h-4 rounded text-[#8338EC] dark:text-purple-500 border-neutral-300 dark:border-neutral-600 dark:bg-[#1E202B] focus:ring-[#8338EC]/20 accent-[#8338EC] cursor-pointer"
                      />
                      <span>{priority.name}</span>
                    </label>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#7023db" }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer self-end mt-2 px-5 py-1.5 bg-[#8338EC] rounded-full text-white text-xs font-medium shadow-sm transition-colors"
                  type="submit"
                >
                  არჩევა
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Divider on Mobile */}
      <div className="hidden md:block h-5 w-[1px] bg-neutral-200 dark:bg-neutral-800 self-center transition-colors duration-300" />

      {/* 3. EMPLOYEE FILTER */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleFilter(3)}
          className={`w-full md:w-auto cursor-pointer flex gap-4 items-center justify-between md:justify-start text-xs md:text-sm font-medium px-4 md:px-3 py-3 md:py-2 rounded-xl transition-colors ${
            showFilts === 3
              ? "bg-neutral-100 dark:bg-neutral-800 text-[#8338EC] dark:text-purple-400"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          }`}
        >
          <span>თანამშრომელი</span>
          <motion.svg
            animate={{ rotate: showFilts === 3 ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 opacity-70 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        <AnimatePresence>
          {showFilts === 3 && (
            <motion.div
              {...popoverAnimation}
              className="bg-white dark:bg-[#2A2D3E] left-0 right-0 md:left-auto md:right-0 top-[calc(100%+6px)] absolute rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 shadow-xl z-50 md:min-w-[300px] transition-colors duration-300"
            >
              <form
                className="flex flex-col gap-2.5"
                onSubmit={handleSubmit((data) => {
                  handleEmployeeFilter(data);
                  setShowFilts(null);
                })}
              >
                <div className="max-h-60 overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
                  {employees?.map((employee: employees) => (
                    <label
                      className="flex gap-3 items-center px-2 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer text-sm text-neutral-700 dark:text-neutral-200 transition-colors select-none"
                      key={employee.id}
                      htmlFor={`emp-${employee.id}`}
                    >
                      <input
                        {...register("employeeFilt")}
                        type="checkbox"
                        value={employee.id}
                        id={`emp-${employee.id}`}
                        className="w-4 h-4 rounded text-[#8338EC] dark:text-purple-500 border-neutral-300 dark:border-neutral-600 dark:bg-[#1E202B] focus:ring-[#8338EC]/20 accent-[#8338EC] cursor-pointer"
                      />
                      <span className="truncate">
                        {employee.name} {employee.surname}
                      </span>
                    </label>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#7023db" }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer self-end mt-2 px-5 py-1.5 bg-[#8338EC] rounded-full text-white text-xs font-medium shadow-sm transition-colors"
                  type="submit"
                >
                  არჩევა
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FilterSection;
