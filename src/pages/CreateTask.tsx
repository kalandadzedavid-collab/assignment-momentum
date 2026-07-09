import { useMutation, useQuery } from "@tanstack/react-query";
import { getData, postData } from "../services/appApi";
import type { priorities, submitTask } from "../types/types";
import { useMemo, useState, useRef, useEffect } from "react";
import type { departments, employees, statuses } from "../types/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<submitTask>({
    defaultValues: {
      status: "1",
      department: "",
      employee: "",
      priority: "",
    },
  });

  // Watch values for our custom display selectors
  const watchDepartment = watch("department");
  const watchStatus = watch("status");

  // Popover toggle states
  const [openDropdown, setOpenDropdown] = useState<
    "dept" | "emp" | "prior" | "status" | null
  >(null);

  // Active label states
  const [selectedPriorObj, setSelectedPriorObj] = useState<priorities | null>(
    null
  );
  const [selectedDeptLabel, setSelectedDeptLabel] = useState("");
  const [selectedEmpLabel, setSelectedEmpLabel] = useState("");

  const addTask = useMutation({
    mutationFn: (data: unknown) => postData("tasks", data),
  });

  // Filter workers based on chosen department
  const filterWorkers = useMemo(() => {
    if (!employees || !watchDepartment) return [];
    return employees.filter(
      (employee: employees) =>
        employee.department_id === Number(watchDepartment)
    );
  }, [watchDepartment, employees]);

  // Reset employee field if department changes
  useEffect(() => {
    if (watchDepartment) {
      const currentDeptId = Number(watchDepartment);
      const matchedDept = departments?.find(
        (d: departments) => d.id === currentDeptId
      );
      if (matchedDept) setSelectedDeptLabel(matchedDept.name);
    }
  }, [watchDepartment, departments]);

  const onSubmit: SubmitHandler<submitTask> = (data) => {
    const selectedPriorityId = Number(data.priority);
    const selectedStatusId = Number(data.status);
    const selectedDepartmentId = Number(data.department);
    const selectedEmployeeId = Number(data.employee);

    const priorityObj = priorities?.find(
      (p: priorities) => p.id === selectedPriorityId
    );
    const statusObj = statuses?.find(
      (s: statuses) => s.id === selectedStatusId
    );
    const departmentObj = departments?.find(
      (d: departments) => d.id === selectedDepartmentId
    );
    const employeeObj = employees?.find(
      (e: employees) => e.id === selectedEmployeeId
    );

    let hasError = false;
    if (!priorityObj) {
      setError("priority", { type: "manual", message: "აირჩიე პრიორიტეტი" });
      hasError = true;
    }
    if (!statusObj) {
      setError("status", { type: "manual", message: "აირჩიე სტატუსი" });
      hasError = true;
    }
    if (!departmentObj) {
      setError("department", {
        type: "manual",
        message: "აირჩიე დეპარტამენტი",
      });
      hasError = true;
    }
    if (!employeeObj) {
      setError("employee", { type: "manual", message: "აირჩიე თანამშრომელი" });
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      name: data.name,
      description: data.description,
      due_date: data.due_date,
      priority_id: selectedPriorityId,
      status_id: selectedStatusId,
      department_id: selectedDepartmentId,
      employee_id: selectedEmployeeId,
    };

    addTask.mutate(payload, {
      onSuccess: () => navigate("/"),
      onError: (err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.data) {
          console.error("Backend validation error:", err.response.data);
        } else {
          console.error("Mutation error:", err);
        }
      },
    });
  };

  // Reusable animation preset matching your main filters
  const popoverAnimation = {
    initial: { opacity: 0, y: 8, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.97 },
    transition: { duration: 0.15, ease: "easeOut" },
  } as const;

  // Close dropdowns on outside click
  const containerRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <main className="max-w-5xl mx-auto mt-10 px-4 md:px-8 pb-16 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-purple-950/40 transition-colors text-neutral-600 dark:text-purple-300 cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-neutral-900 dark:text-neutral-100 text-2xl font-bold tracking-tight transition-colors">
          ახალი დავალების შექმნა
        </h1>
      </div>

      <form
        ref={containerRef}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-[#1A1226] border border-neutral-200 dark:border-purple-900/30 rounded-2xl p-6 md:p-10 shadow-sm overflow-visible transition-all duration-300"
      >
        {/* Hidden inputs to make react-hook-form register functional */}
        <input
          type="hidden"
          {...register("department", { required: "აირჩიე დეპარტამენტი" })}
        />
        <input
          type="hidden"
          {...register("employee", {
            required: "თანამშრომლის არჩევა სავალდებულოა",
          })}
        />
        <input
          type="hidden"
          {...register("priority", { required: "სავალდებულოა" })}
        />
        <input type="hidden" {...register("status")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors"
              >
                საურავები <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", {
                  required: "ველის შევსება სავალდებულოა",
                  minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                  maxLength: { value: 255, message: "მაქსიმუმ 255 სიმბოლო" },
                })}
                id="name"
                type="text"
                className={`w-full px-4 py-3 bg-neutral-50 dark:bg-[#251B33] border rounded-xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-purple-300/30 focus:outline-none focus:bg-white dark:focus:bg-[#251B33] focus:ring-4 transition-all ${
                  errors.name
                    ? "border-red-500 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20"
                    : "border-neutral-200 dark:border-purple-900/40 focus:border-[#8338EC] dark:focus:border-purple-500 focus:ring-[#8338EC]/10 dark:focus:ring-purple-500/10"
                }`}
                placeholder="შეიყვანეთ დავალების სათაური"
              />
              {errors?.name ? (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                  {errors.name.message}
                </p>
              ) : (
                <p className="text-neutral-400 dark:text-purple-300/40 text-[11px] mt-1 transition-colors">
                  მინიმუმ 2 და მაქსიმუმ 255 სიმბოლო
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors"
              >
                აღწერა <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "ველის შევსება სავალდებულოა",
                  minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                  maxLength: { value: 1000, message: "მაქსიმუმ 1000 სიმბოლო" },
                })}
                id="description"
                rows={6}
                className={`w-full px-4 py-3 bg-neutral-50 dark:bg-[#251B33] border rounded-xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-purple-300/30 focus:outline-none focus:bg-white dark:focus:bg-[#251B33] focus:ring-4 transition-all resize-none ${
                  errors.description
                    ? "border-red-500 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20"
                    : "border-neutral-200 dark:border-purple-900/40 focus:border-[#8338EC] dark:focus:border-purple-500 focus:ring-[#8338EC]/10 dark:focus:ring-purple-500/10"
                }`}
                placeholder="აღწერეთ დავალების დეტალები..."
              />
              {errors?.description ? (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-neutral-400 dark:text-purple-300/40 text-[11px] mt-1 transition-colors">
                  დაამატეთ მოკლე ან ვრცელი სამუშაო აღწერილობა
                </p>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6 justify-between">
            {/* DYNAMIC CUSTOM DEPT DROPDOWN */}
            <div className="relative">
              <label className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors">
                დეპარტამენტი <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(openDropdown === "dept" ? null : "dept")
                }
                className={`w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-[#251B33] border rounded-xl text-left transition-all cursor-pointer focus:outline-none focus:ring-4 ${
                  openDropdown === "dept"
                    ? "border-[#8338EC] dark:border-purple-500 ring-[#8338EC]/10 dark:ring-purple-500/10 bg-white dark:bg-[#251B33]"
                    : "border-neutral-200 dark:border-purple-900/40"
                } ${
                  errors.department
                    ? "border-red-500 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20"
                    : ""
                }`}
              >
                <span
                  className={
                    selectedDeptLabel
                      ? "text-neutral-800 dark:text-neutral-100"
                      : "text-neutral-400 dark:text-purple-300/40"
                  }
                >
                  {selectedDeptLabel || "აირჩიეთ დეპარტამენტი"}
                </span>
                <motion.svg
                  animate={{ rotate: openDropdown === "dept" ? 180 : 0 }}
                  className="w-4 h-4 text-neutral-500 dark:text-purple-300/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openDropdown === "dept" && (
                  <motion.div
                    {...popoverAnimation}
                    className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white dark:bg-[#1A1226] border border-neutral-100 dark:border-purple-900/40 shadow-xl rounded-2xl p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {departments?.map((depart: departments) => (
                      <button
                        key={depart.id}
                        type="button"
                        onClick={() => {
                          setValue("department", String(depart.id));
                          setValue("employee", ""); // safe wipe
                          setSelectedEmpLabel("");
                          setSelectedDeptLabel(depart.name);
                          clearErrors("department");
                          setOpenDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-purple-500/10 text-sm text-neutral-700 dark:text-purple-200 rounded-xl transition-colors cursor-pointer"
                      >
                        {depart.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.department && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                  {errors.department.message}
                </p>
              )}
            </div>

            {/* DYNAMIC CUSTOM WORKER DROPDOWN */}
            <div className="relative">
              <label className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors">
                პასუხისმგებელი თანამშრომელი{" "}
                <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                disabled={!watchDepartment}
                onClick={() =>
                  setOpenDropdown(openDropdown === "emp" ? null : "emp")
                }
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-left transition-all ${
                  !watchDepartment
                    ? "bg-neutral-100 dark:bg-purple-950/20 border-neutral-200 dark:border-purple-950/40 text-neutral-400 dark:text-purple-300/20 cursor-not-allowed"
                    : "bg-neutral-50 dark:bg-[#251B33] border-neutral-200 dark:border-purple-900/40 cursor-pointer focus:outline-none focus:ring-4"
                } ${
                  openDropdown === "emp"
                    ? "border-[#8338EC] dark:border-purple-500 ring-[#8338EC]/10 dark:ring-purple-500/10 bg-white dark:bg-[#251B33]"
                    : ""
                } ${
                  errors.employee
                    ? "border-red-500 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20"
                    : ""
                }`}
              >
                <span
                  className={
                    selectedEmpLabel
                      ? "text-neutral-800 dark:text-neutral-100"
                      : "text-neutral-400 dark:text-purple-300/40"
                  }
                >
                  {watchDepartment
                    ? selectedEmpLabel || "აირჩიეთ თანამშრომელი"
                    : "ჯერ აირჩიეთ დეპარტამენტი"}
                </span>
                <motion.svg
                  animate={{ rotate: openDropdown === "emp" ? 180 : 0 }}
                  className="w-4 h-4 text-neutral-500 dark:text-purple-300/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openDropdown === "emp" && watchDepartment && (
                  <motion.div
                    {...popoverAnimation}
                    className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white dark:bg-[#1A1226] border border-neutral-100 dark:border-purple-900/40 shadow-xl rounded-2xl p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"
                  >
                    {filterWorkers.length === 0 ? (
                      <p className="text-xs text-neutral-400 dark:text-purple-300/40 p-3 text-center">
                        თანამშრომლები ვერ მოიძებნა
                      </p>
                    ) : (
                      filterWorkers.map((worker: employees) => (
                        <button
                          key={worker.id}
                          type="button"
                          onClick={() => {
                            setValue("employee", String(worker.id));
                            setSelectedEmpLabel(
                              `${worker.name} ${worker.surname}`
                            );
                            clearErrors("employee");
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-purple-500/10 text-sm text-neutral-700 dark:text-purple-200 rounded-xl transition-colors cursor-pointer"
                        >
                          {worker.name} {worker.surname}
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {errors.employee && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                  {errors.employee.message}
                </p>
              )}
            </div>

            {/* PRIORITY & STATUS IN GRID BOX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CUSTOM PRIORITY DROPDOWN WITH ICONS */}
              <div className="relative">
                <label className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors">
                  პრიორიტეტი <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "prior" ? null : "prior")
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-[#251B33] border rounded-xl text-left transition-all cursor-pointer focus:outline-none focus:ring-4 ${
                    openDropdown === "prior"
                      ? "border-[#8338EC] dark:border-purple-500 ring-[#8338EC]/10 dark:ring-purple-500/10 bg-white dark:bg-[#251B33]"
                      : "border-neutral-200 dark:border-purple-900/40"
                  } ${
                    errors.priority
                      ? "border-red-500 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedPriorObj?.icon && (
                      <img
                        src={selectedPriorObj.icon}
                        alt=""
                        className="w-4 h-4 object-contain dark:brightness-110"
                      />
                    )}
                    <span
                      className={
                        selectedPriorObj
                          ? "text-neutral-800 dark:text-neutral-100"
                          : "text-neutral-400 dark:text-purple-300/40"
                      }
                    >
                      {selectedPriorObj?.name || "პრიორიტეტი"}
                    </span>
                  </div>
                  <motion.svg
                    animate={{ rotate: openDropdown === "prior" ? 180 : 0 }}
                    className="w-4 h-4 text-neutral-500 dark:text-purple-300/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {openDropdown === "prior" && (
                    <motion.div
                      {...popoverAnimation}
                      className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white dark:bg-[#1A1226] border border-neutral-100 dark:border-purple-900/40 shadow-xl rounded-2xl p-2 z-50"
                    >
                      {priorities?.map((priority: priorities) => (
                        <button
                          key={priority.id}
                          type="button"
                          onClick={() => {
                            setValue("priority", String(priority.id));
                            setSelectedPriorObj(priority);
                            clearErrors("priority");
                            setOpenDropdown(null);
                          }}
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-purple-500/10 text-sm text-neutral-700 dark:text-purple-200 rounded-xl transition-colors cursor-pointer"
                        >
                          {priority.icon && (
                            <img
                              src={priority.icon}
                              alt=""
                              className="w-4 h-4 object-contain dark:brightness-110"
                            />
                          )}
                          {priority.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.priority && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
                    {errors.priority.message}
                  </p>
                )}
              </div>

              {/* CUSTOM STATUS DROPDOWN */}
              <div className="relative">
                <label className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors">
                  სტატუსი
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "status" ? null : "status")
                  }
                  className={`w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-[#251B33] border border-neutral-200 dark:border-purple-900/40 rounded-xl text-left transition-all cursor-pointer focus:outline-none focus:ring-4 ${
                    openDropdown === "status"
                      ? "border-[#8338EC] dark:border-purple-500 ring-[#8338EC]/10 dark:ring-purple-500/10 bg-white dark:bg-[#251B33]"
                      : ""
                  }`}
                >
                  <span className="text-neutral-800 dark:text-neutral-100">
                    {statuses?.find(
                      (s: statuses) => String(s.id) === watchStatus
                    )?.name || "სტატუსი"}
                  </span>
                  <motion.svg
                    animate={{ rotate: openDropdown === "status" ? 180 : 0 }}
                    className="w-4 h-4 text-neutral-500 dark:text-purple-300/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {openDropdown === "status" && (
                    <motion.div
                      {...popoverAnimation}
                      className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white dark:bg-[#1A1226] border border-neutral-100 dark:border-purple-900/40 shadow-xl rounded-2xl p-2 z-50"
                    >
                      {statuses?.map((item: statuses) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setValue("status", String(item.id));
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-purple-500/10 text-sm text-neutral-700 dark:text-purple-200 rounded-xl transition-colors cursor-pointer"
                        >
                          {item.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* DEADLINE */}
<div>
  <label htmlFor="deadline" className="block text-neutral-700 dark:text-purple-200 font-medium text-sm mb-2 transition-colors">
    დედლაინი <span className="text-red-500">*</span>
  </label>
  <input
    {...register("due_date", { 
      required: "აირჩიე დედლაინი",
      validate: (value) => {
        const pickedDate = new Date(value).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        return pickedDate >= today || "წარსული თარიღის არჩევა შეზღუდულია";
      }
    })}
    type="date"
    id="deadline"
    min={new Date().toISOString().split("T")[0]}
    className={`w-full px-4 py-3 bg-neutral-50 dark:bg-[#251B33] border rounded-xl text-neutral-800 dark:text-neutral-100 focus:outline-none focus:bg-white dark:focus:bg-[#251B33] focus:ring-4 transition-all dark:[color-scheme:dark] ${
      errors.due_date 
        ? 'border-red-500 dark:border-red-500 focus:ring-red-100 dark:focus:ring-red-950/20' 
        : 'border-neutral-200 dark:border-purple-900/40 focus:border-[#8338EC] dark:focus:border-purple-500 focus:ring-[#8338EC]/10 dark:focus:ring-purple-500/10'
    }`}
  />
  {errors.due_date && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.due_date.message}</p>}
</div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-12 pt-6 border-t border-neutral-100 dark:border-purple-900/20 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 border border-neutral-200 dark:border-purple-900/40 rounded-xl text-neutral-700 dark:text-purple-200 font-medium hover:bg-neutral-50 dark:hover:bg-purple-950/20 active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            გაუქმება
          </button>
          <button
            disabled={addTask.isPending}
            className="px-6 py-3 bg-[#8338EC] text-white font-medium rounded-xl shadow-sm hover:bg-[#7023db] disabled:bg-neutral-300 dark:disabled:bg-purple-950/50 disabled:text-neutral-500 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer text-sm"
            type="submit"
          >
            {addTask.isPending ? "მიმდინარეობს..." : "დავალების შექმნა"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateTask;
