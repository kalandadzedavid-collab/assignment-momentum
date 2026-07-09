import { Link } from "react-router-dom";
import DepartButton from "./DepartButton";
import DiffButton from "./DiffButton";
import type { postTask } from "../types/types";
import { motion } from "framer-motion";

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
    ? new Date(data.due_date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // Dynamic background mapping optimized for high-end presentation contrast in both themes
  const getSubtleBg = (outlineClass?: string) => {
    if (outlineClass?.includes("#F7BC30"))
      return "bg-[#F7BC30]/5 dark:bg-[#F7BC30]/10";
    if (outlineClass?.includes("#FB5607"))
      return "bg-[#FB5607]/5 dark:bg-[#FB5607]/10";
    if (outlineClass?.includes("#FF006E") || outlineClass?.includes("#FF2080"))
      return "bg-[#FF006E]/5 dark:bg-[#FF006E]/10";
    if (outlineClass?.includes("#3A86FF"))
      return "bg-[#3A86FF]/5 dark:bg-[#3A86FF]/10";
    return "bg-neutral-50/50 dark:bg-neutral-900/20";
  };

  return (
    <Link
      to={`details/${data.id}`}
      className="block w-full max-w-95 no-underline group"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${outline_col} w-full bg-white dark:bg-[#2A2D3E] rounded-2xl outline outline-1.5 shadow-sm group-hover:shadow-md transition-all duration-300 flex flex-col justify-between h-56.25 overflow-hidden`}
      >
        {/* Main Body Wrap */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          {/* Top Badges & Date Section */}
          <div className="flex items-center gap-2 flex-wrap">
            {data.priority && <DiffButton priority={data.priority} />}
            {data.department && <DepartButton depart={data.department} />}
            <span className="ml-auto text-[11px] font-medium text-neutral-400 dark:text-purple-300/40 tracking-wide uppercase transition-colors duration-300">
              {formatedDate}
            </span>
          </div>

          {/* Mid Text Section */}
          <div className="mt-4 mb-2 px-0.5">
            <h3 className="mb-2 text-neutral-800 dark:text-neutral-100 text-base font-semibold tracking-tight leading-snug group-hover:text-[#8338EC] dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-2">
              {data.name}
            </h3>
            <p className="max-h-10 text-neutral-500 dark:text-neutral-400 text-sm font-normal line-clamp-3 leading-relaxed transition-colors duration-300">
              {data.description}
            </p>
          </div>
        </div>

        {/* Footer Section: Tinted Background with adaptive borders */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-t border-neutral-100/70 dark:border-purple-950/40 transition-colors duration-300 ${getSubtleBg(
            outline_col
          )}`}
        >
          <div className="flex items-center">
            {data.employee?.avatar ? (
              <img
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[#150D22] shadow-sm group-hover:ring-[#8338EC]/20 dark:group-hover:ring-[#8338EC]/40 transition-all duration-300"
                src={data.employee.avatar}
                alt={`${data.employee.name ?? "employee"}`}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-[#1C122C] flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-xs font-semibold uppercase ring-2 ring-white dark:ring-[#150D22] transition-colors duration-300">
                <span>{data.employee?.name?.[0] || "E"}</span>
              </div>
            )}
          </div>

          {/* Comment Counter with Adaptive Glass Panels */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="flex items-center gap-1.5 text-neutral-400 dark:text-purple-300/60 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 font-medium text-xs transition-colors duration-200 bg-white dark:bg-[#1C122C] border border-neutral-100 dark:border-purple-950/60 rounded-lg px-2.5 py-1 shadow-sm"
          >
            <img
              src="/icons/Comments.svg"
              className="w-3.5 h-3.5 opacity-80 dark:invert dark:opacity-60 group-hover:opacity-100 transition-all"
              alt="Comments count icon"
            />
            <span>{data.total_comments ?? 0}</span>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
};

export default Task;
