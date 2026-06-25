import { useMutation, useQuery } from "@tanstack/react-query";
import { getData, postData } from "../services/appApi";
import type { priorities, submitTask } from "../types/types";
import { useMemo, useState } from "react";
import type { departments, employees, statuses } from "../types/types";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
    formState: { errors },
    setError,
  } = useForm<submitTask>();

  const addTask = useMutation({
    // Accept a generic payload here (we send an array of task objects)
    mutationFn: (data: unknown) => postData("tasks", data),
  });

  const onSubmit: SubmitHandler<submitTask> = (data) => {
    console.log(data);

    // Convert string ids from form to numbers
    const selectedPriorityId = Number(data.priority);
    const selectedStatusId = Number(data.status);
    const selectedDepartmentId = Number(data.department);
    const selectedEmployeeId = Number(data.employee);

    // Use find to get single objects (safer and clearer)
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

    // Validate presence of referenced objects before sending
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

    if (hasError) return; // stop submission if any referenced object is missing

    // Build payload for creation: send primitive ids (backend commonly expects *_id fields)
    const payload = {
      name: data.name,
      description: data.description,
      due_date: data.due_date,
      priority_id: selectedPriorityId,
      status_id: selectedStatusId,
      department_id: selectedDepartmentId,
      employee_id: selectedEmployeeId,
    };

    console.log("Outgoing payload:", payload);

    addTask.mutate(payload, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (err: unknown) => {
        // Try to show backend validation response if available
        // Axios errors carry response.data with details
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyErr = err as any;
        if (anyErr?.response?.data) {
          console.error("Backend validation error:", anyErr.response.data);
        } else {
          console.error("Mutation error:", err);
        }
      },
    });
  };

  const [selectedPrior, setSelectcedPrior] = useState<number | null>(null);
  const [selectedDepart, setSelectedDepart] = useState<number | null>(null);

  // console.log(priorities);
  console.log(statuses);
  // console.log(departments);
  // console.log(employees);
  // console.log(selectedDepart);

  const filterWorkers = useMemo(() => {
    if (!employees) return [];

    return employees.filter((employee: employees) => {
      return employee.department_id == selectedDepart;
    });
  }, [selectedDepart, employees]);

  console.log("filtered", filterWorkers);

  return (
    <main className="mt-10 px-10">
      <h1 className="mb-6 text-neutral-800 text-2xl font-semibold">
        შექმენი ახალი დავალება
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-[#FCFBFF] px-13.75 py-16.25"
      >
        <div className="flex flex-col xl:flex-row gap-5 justify-between">
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
                {...register("name", {
                  required: "ველის შევსება სავალდებულოა",
                  minLength: {
                    value: 2,
                    message: "მინიმუმ 2 სიმბოლო",
                  },
                  maxLength: {
                    value: 255,
                    message: "მაქსიმუმ 255 სიმბოლო",
                  },
                })}
                id="name"
                className="w-full xl:w-137.5 p-3.5 bg-white rounded-[5px] outline outline-zinc-200"
                type="text"
              />
              {!errors?.name && (
                <div>
                  <p
                    className={`text-gray-500
text-[10px]`}
                  >
                    მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className="text-gray-500
text-[10px]"
                  >
                    მაქსიმუმ 255 სიმბოლო
                  </p>
                </div>
              )}
              <p className="text-red-600">{errors?.name?.message}</p>
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
                {...register("description", {
                  required: "ველის შევსება სავალდებულოა",
                  minLength: {
                    value: 2,
                    message: "მინიმუმ 2 სიმბოლო",
                  },
                  maxLength: {
                    value: 255,
                    message: "მაქსიმუმ 255 სიმბოლო",
                  },
                })}
                id="description"
                className="w-full xl:w-137.5 h-32 p-3.5 bg-white rounded-[5px] outline outline-zinc-200"
              />
              {!errors?.description && (
                <div>
                  <p
                    className={`text-gray-500
text-[10px]`}
                  >
                    მინიმუმ 2 სიმბოლო
                  </p>
                  <p
                    className="text-gray-500
text-[10px]"
                  >
                    მაქსიმუმ 255 სიმბოლო
                  </p>
                </div>
              )}
              <p className="text-red-600">{errors?.description?.message}</p>
            </label>

            <div className="flex flex-col xl:flex-row gap-10">
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
                    src={
                      priorities && selectedPrior != null
                        ? priorities[selectedPrior - 1]?.icon
                        : undefined
                    }
                    alt=""
                  />
                  <select
                    {...register("priority", {
                      required: "სავალდებულოა",
                    })}
                    onChange={(e) => setSelectcedPrior(+e.target.value)}
                    className="w-full text-[12px] outline-0 md:text-base"
                    id="priority"
                  >
                    <option value="">აირჩიე პრიორიტეტი</option>
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
                <p className="text-red-400">{errors?.priority?.message}</p>
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
                  <select
                    {...register("status")}
                    id="status"
                    className="outline-0 w-full text-[12px] md:text-base"
                  >
                    {statuses &&
                      statuses.map((item: statuses) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
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

              <div className="h-13 rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-[70%] xl:w-137.5">
                <select
                  defaultValue={""}
                  {...register("department", {
                    required: "აირჩიე დეპარტამენტი",
                  })}
                  onChange={(e) => setSelectedDepart(+e.target.value)}
                  className="w-full outline-0 text-[9px] md:text-base"
                  id="departments"
                >
                  <option value={""}>აირჩიე დეპარტამენტი</option>
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
              <p className="text-red-400">
                {errors.department && errors?.department?.message}
              </p>
            </label>

            <label htmlFor="worker" className="my-5 xl:my-[unset]">
              <p
                className="text-gray-400
text-base
font-normal"
              >
                პასუხისმგებელი თანამშრომელი
              </p>

              <div className="h-13 rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-[70%] xl:w-137.5">
                <select
                  {...register("employee", {
                    required: "თანამშრომლის არჩევა სავალდებულოა",
                  })}
                  className="w-full outline-0 text-[11px] md:text-base"
                  id="worker"
                >
                  <option value={""}>აირჩიე თანამშრომელი</option>
                  {filterWorkers &&
                    filterWorkers.map((worker: employees) => {
                      return (
                        <option value={worker.id} key={worker.id}>
                          {worker.name + " " + worker.surname}
                        </option>
                      );
                    })}
                </select>
              </div>
              <p className="text-red-400">{errors?.employee?.message}</p>
            </label>

            <label htmlFor="deadline">
              <div className="w-[70%] xl:w-79.5 h-13 rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white">
                <input
                  {...register("due_date", {
                    required: "აირჩიე დედლაინი",
                  })}
                  className="outline-0"
                  type="date"
                  id="deadline"
                />
              </div>
              <p className="text-red-400">{errors?.due_date?.message}</p>
            </label>
          </div>
        </div>

        <button
          className="mt-10 self-end px-5 py-2.5 bg-[#8338EC] text-white"
          type="submit"
        >
          დავალების შექმნა
        </button>
      </form>
    </main>
  );
};

export default CreateTask;
