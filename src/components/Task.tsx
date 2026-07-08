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

  // Dynamic background mapping based on outline colors to give the bottom border a premium tint
  const getSubtleBg = (outlineClass?: string) => {
    if (outlineClass?.includes("#F7BC30")) return "bg-[#F7BC30]/5";
    if (outlineClass?.includes("#FB5607")) return "bg-[#FB5607]/5";
    if (outlineClass?.includes("#FF006E") || outlineClass?.includes("#FF2080")) return "bg-[#FF006E]/5";
    if (outlineClass?.includes("#3A86FF")) return "bg-[#3A86FF]/5";
    return "bg-neutral-50/50";
  };

  return (
    <Link to={`details/${data.id}`} className="block w-full max-w-[380px] no-underline group">
      <motion.div
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`${outline_col} w-full bg-white rounded-2xl outline outline-1.5 shadow-sm group-hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[225px] overflow-hidden`}
      >
        {/* Main Body Wrap */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          {/* Top Badges & Date Section */}
          <div className="flex items-center gap-2 flex-wrap">
            {data.priority && <DiffButton priority={data.priority} />}
            {data.department && <DepartButton depart={data.department} />}
            <span className="ml-auto text-[11px] font-medium text-neutral-400 tracking-wide uppercase">
              {formatedDate}
            </span>
          </div>

          {/* Mid Text Section */}
          <div className="mt-4 mb-2 px-0.5">
            <h3 className="mb-2 text-neutral-800 text-base font-semibold tracking-tight leading-snug group-hover:text-[#8338EC] transition-colors duration-200 line-clamp-2">
              {data.name}
            </h3>
            <p className="text-neutral-500 text-sm font-normal line-clamp-3 leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>

        {/* Footer Section: Custom Tinted Background on Hover */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-t border-neutral-100/70 transition-colors duration-300 ${getSubtleBg(outline_col)}`}>
          <div className="flex items-center">
            {data.employee?.avatar ? (
              <img
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-[#8338EC]/20 transition-all duration-300"
                src={data.employee.avatar}
                alt={`${data.employee.name ?? "employee"}`}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs font-semibold uppercase ring-2 ring-white">
                <span>{data.employee?.name?.[0] || "E"}</span>
              </div>
            )}
          </div>

          {/* Comment Counter with Micro-Wiggle Transition */}
          <motion.div 
            whileHover={{ scale: 1.08 }}
            className="flex items-center gap-1.5 text-neutral-400 group-hover:text-neutral-600 font-medium text-xs transition-colors duration-200 bg-white border border-neutral-100 rounded-lg px-2.5 py-1 shadow-sm"
          >
            <img 
              src="/icons/Comments.svg" 
              className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" 
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