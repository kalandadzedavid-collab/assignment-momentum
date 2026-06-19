import { useNavigate, useParams } from "react-router-dom";
import { getData, putData } from "../services/appApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import DiffButton from "../components/DiffButton";
import DepartButton from "../components/DepartButton";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const { data: task } = useQuery({
    queryKey: ["task"],
    queryFn: () => getData(`tasks/${id}`),
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: () => getData("statuses"),
  });

  const updateTaskStatus = useMutation({
    // Accept an object containing the task id and the new status
    mutationFn: (data: unknown) => putData(`tasks/${id}`, data),
  });

  console.log(statuses);
  console.log(task);

  const formatedDate = `${new Date(task?.due_date).toLocaleDateString("en-GB", {
    weekday: "short",
  })} - ${new Date(task?.due_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
  console.log(formatedDate);
  return (
    <main className="px-30 mt-12.5">
      <section>
        <div className="flex gap-2">
          {task && <DiffButton priority={task.priority} />}
          {task && <DepartButton depart={task.department} />}
        </div>

        <div className="max-w-178.75">
          <h1
            className="mt-4 mb-8 text-neutral-800
text-4xl
font-semibold"
          >
            {task?.name}
          </h1>
          <p
            className="text-black
text-lg
font-normal"
          >
            {task?.description}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h2
            className=" mt-18.25 text-zinc-800
text-2xl
font-medium"
          >
            დავალების დეტალები
          </h2>
          <div className="flex items-center gap-15">
            <button
              className="flex gap-1 text-zinc-700
text-base
font-normal"
            >
              <img src="/icons/pie-chart.svg" alt="a" />
              სტატუსი
            </button>
            <label htmlFor="status">
              <div className="rounded outline outline-zinc-200 px-5 flex gap-2 justify-start items-center bg-white w-64 h-11">
                <select
                  onChange={(e) => {
                    const selectedStatusId = Number(e.target.value);
                    // Send only the expected primitive id field to the backend
                    const payload = { status_id: selectedStatusId };
                    console.log("Updating status with:", payload);
                    updateTaskStatus.mutate(payload, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (err) => {
        console.error("Mutation error:", err);
      },
    });

                  }}
                  id="status"
                  className="outline-0"
                >
                  <option selected disabled>
                    შეცვალე სტატუსი
                  </option>
                  {statuses &&
                    statuses
                      .filter(
                        (stat: { name: unknown }) =>
                          stat.name !== task?.status?.name
                      )
                      .map((status: { id: number; name: string }) => {
                        return (
                          <option value={status.id} key={status.id}>
                            {status.name}
                          </option>
                        );
                      })}
                </select>
              </div>
            </label>
          </div>
          <div className="flex items-center gap-10">
            <button
              className="flex gap-1 text-zinc-700
text-base
font-normal"
            >
              <img src="/icons/user.svg" alt="a" />
              თანამშრომელი
            </button>
            <div className="flex items-center gap-3">
              <img
                className="size-8 rounded-full"
                src={task?.employee?.avatar}
                alt=""
              />
              <div>
                <span
                  className="text-zinc-700
text-xs
font-light"
                >
                  {task?.department?.name}
                </span>
                <p
                  className="text-neutral-950
text-sm
font-normal"
                >
                  {task?.employee?.name + " " + task?.employee?.surname}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <button
              className="flex gap-1 text-zinc-700
text-base
font-normal"
            >
              <img src="/icons/calendar.svg" alt="a" />
              დავალების ვადა
            </button>
            <p
              className="text-neutral-950
text-sm
font-normal"
            >
              {formatedDate}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TaskDetails;
