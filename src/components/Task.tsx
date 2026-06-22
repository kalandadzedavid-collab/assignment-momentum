import { Link } from "react-router-dom";
import DepartButton from "./DepartButton";
import DiffButton from "./DiffButton";
import type { postTask } from "../types/types";

type TaskData = Partial<postTask> & {
  total_comments?: number;
  id: string | number;
};

const Task = ({
  data,
  outline_col,
}: {
  data: TaskData;
  outline_col?: string;
}) => {
  const formatedDate = data.due_date
    ? new Date(data.due_date).toLocaleDateString("ka-GE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // console.log(data);
  return (
    <Link to={`details/${data.id}`}>
      <div
        className={`${outline_col} max-w-95.25 p-5 bg-white rounded-2xl outline`}
      >
        <div className="flex gap-2">
          {data.priority && <DiffButton priority={data.priority} />}
          {data.department && <DepartButton depart={data.department} />}
          <p className="ml-auto">{formatedDate}</p>
        </div>

        <div className="my-7.5 px-2.5">
          <p
            className="mb-3 text-neutral-800
text-base
font-medium"
          >
            {data.name}
          </p>
          <p
            className="text-neutral-700
text-sm
font-normal"
          >
            {data.description}
          </p>
        </div>

        <div className="flex justify-between">
          <img
            className="size-8 rounded-full"
            src={data.employee?.avatar ?? ""}
            alt=""
          />
          <button className="flex items-center gap-1">
            <img src="./icons/Comments.svg" alt="" />
            {data.total_comments ?? 0}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Task;
