import { useNavigate, useParams } from "react-router-dom";
import { getData, postData, putData } from "../services/appApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DiffButton from "../components/DiffButton";
import DepartButton from "../components/DepartButton";
import Comments from "../components/Comments";
import { useForm } from "react-hook-form";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getData(`tasks/${id}/comments`),
  });

  const { data: task } = useQuery({
    queryKey: ["task"],
    queryFn: () => getData(`tasks/${id}`),
  });

  const { data: statuses } = useQuery({
    queryKey: ["statuses"],
    queryFn: () => getData("statuses"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addComment = useMutation({
    mutationFn: (data: { text: string; parent_id: null }) =>
      postData(`tasks/${id}/comments`, data),
  });

  const queryClient = useQueryClient();

  function handleComment(data: { text: string }) {
    const finalComment = { ...data, parent_id: null };
    

    addComment.mutate(finalComment, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
        reset();
      },
      onError: (err) => {
        console.error("Mutation error:", err);
      },
    });
  }

  const updateTaskStatus = useMutation({
    // Accept an object containing the task id and the new status
    mutationFn: (data: unknown) => putData(`tasks/${id}`, data),
  });

  

  const formatedDate = `${new Date(task?.due_date).toLocaleDateString("en-GB", {
    weekday: "short",
  })} - ${new Date(task?.due_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
  
  return (
    <main className="px-30 mt-12.5 flex justify-between">
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
      <section className="bg-[#FAF7FE] outline-[0.30px] outline-offset-[-0.30px] outline-violet-200 rounded-[10px] p-10">
        {errors?.text?.message && (
  <p className="text-red-500">
    {errors.text.message as string}
  </p>
)}
        <form
          onSubmit={handleSubmit(handleComment)}
          className="bg-white p-5 flex flex-col rounded-[10px] outline-[0.30px] outline-offset-[-0.30px] outline-gray-400"
        >
          <textarea
            {...register("text", {
              required: "text is required",
              minLength: {
                value: 2,
                message: "minimum length is 2 characters",
              },
            })}
            className="resize-none outline-0 w-162.75 h-20"
            placeholder="დაწერე კომენტარი"
          ></textarea>

          <button
            className="cursor-pointer ml-auto mt-3 w-40 px-5 py-2 bg-violet-600 rounded-[20px] text-white
text-base
font-normal"
            type="submit"
          >
            დააკომენტარე
          </button>
        </form>

        <Comments comments={comments} />
      </section>
    </main>
  );
};

export default TaskDetails;
