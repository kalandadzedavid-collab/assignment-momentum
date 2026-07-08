import { useNavigate, useParams } from "react-router-dom";
import { getData, postData, putData } from "../services/appApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DiffButton from "../components/DiffButton";
import DepartButton from "../components/DepartButton";
import Comments from "../components/Comments";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom select dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => getData(`tasks/${id}/comments`),
  });

  const { data: task } = useQuery({
    queryKey: ["task", id],
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
  } = useForm<{ text: string }>();

  const addComment = useMutation({
    mutationFn: (data: { text: string; parent_id: null }) =>
      postData(`tasks/${id}/comments`, data),
  });

  function handleComment(data: { text: string }) {
    const finalComment = { ...data, parent_id: null };

    addComment.mutate(finalComment, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", id] });
        reset();
      },
      onError: (err) => {
        console.error("Mutation error:", err);
      },
    });
  }

  const updateTaskStatus = useMutation({
    mutationFn: (data: { status_id: number }) => putData(`tasks/${id}`, data),
  });

  const formatedDate = task?.due_date
    ? `${new Date(task.due_date).toLocaleDateString("en-GB", {
        weekday: "short",
      })} - ${new Date(task.due_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`
    : "";

  return (
    <main className="mb-20 px-4 sm:px-6 md:px-10 mt-10 gap-12 flex flex-col xl:flex-row items-start max-w-[1600px] mx-auto w-full">
      
      {/* LEFT SECTION: Task Info & Attributes */}
      <section className="flex-1 w-full max-w-3xl">
        <div className="flex gap-2 flex-wrap items-center">
          {task && <DiffButton priority={task.priority} />}
          {task && <DepartButton depart={task.department} />}
        </div>

        <div className="mt-4 mb-10">
          <h1 className="text-neutral-800 text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {task?.name}
          </h1>
          <p className="text-neutral-600 text-base md:text-lg font-normal leading-relaxed whitespace-pre-wrap">
            {task?.description}
          </p>
        </div>

        {/* Task Properties Grid */}
        <div className="border-t border-neutral-100 pt-8 flex flex-col gap-6 w-full max-w-xl">
          <h2 className="text-neutral-800 text-xl font-semibold mb-2">
            დავალების დეტალები
          </h2>

          {/* 1. Custom Status Selector Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex gap-2 text-neutral-500 text-sm font-medium items-center">
              <img src="/icons/pie-chart.svg" className="w-4 h-4 opacity-70" alt="" />
              <span>სტატუსი</span>
            </div>
            
            <div className="relative w-full sm:w-64" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-11 px-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between text-sm font-medium text-neutral-700 shadow-sm hover:border-neutral-300 transition-colors focus:outline-none focus:border-[#8338EC] focus:ring-2 focus:ring-[#8338EC]/10 cursor-pointer"
              >
                <span className="truncate">
                  {task?.status?.name || "შეცვალე სტატუსი"}
                </span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-neutral-400 flex-shrink-0 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                  >
                    {statuses &&
                      statuses
                        .filter((stat: { name: string }) => stat.name !== task?.status?.name)
                        .map((status: { id: number; name: string }) => (
                          <button
                            key={status.id}
                            type="button"
                            onClick={() => {
                              const payload = { status_id: status.id };
                              setIsOpen(false);
                              updateTaskStatus.mutate(payload, {
                                onSuccess: () => {
                                  queryClient.invalidateQueries({ queryKey: ["task", id] });
                                  navigate("/");
                                },
                                onError: (err) => {
                                  console.error("Mutation error:", err);
                                },
                              });
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#8338EC] font-medium transition-colors border-b border-neutral-50/60 last:border-none cursor-pointer"
                          >
                            {status.name}
                          </button>
                        ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 2. Employee Profile Row */}
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex gap-2 text-neutral-500 text-sm font-medium items-center">
              <img src="/icons/user.svg" className="w-4 h-4 opacity-70" alt="" />
              <span>თანამშრომელი</span>
            </div>
            
            <div className="flex items-center gap-3 bg-neutral-50/50 p-2 pr-4 rounded-xl border border-neutral-100 w-fit">
              {task?.employee?.avatar ? (
                <img
                  className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-white"
                  src={task.employee.avatar}
                  alt=""
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                  {task?.employee?.name?.[0] || "E"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-neutral-400 text-[10px] font-semibold uppercase tracking-wider">
                  {task?.department?.name || "დეპარტამენტი"}
                </span>
                <p className="text-neutral-800 text-sm font-medium">
                  {task?.employee ? `${task.employee.name} ${task.employee.surname}` : "გაუნაწილებელი"}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex gap-2 text-neutral-500 text-sm font-medium items-center">
              <img src="/icons/calendar.svg" className="w-4 h-4 opacity-70" alt="" />
              <span>დავალების ვადა</span>
            </div>
            <p className="text-neutral-800 text-sm font-semibold bg-neutral-50/60 px-3 py-1.5 rounded-lg border border-neutral-100 w-fit">
              {formatedDate}
            </p>
          </div>
        </div>
      </section>

      {/* RIGHT SECTION: Feed / Comments Wrapper Block */}
      <section className="w-full xl:w-[460px] lg:shrink-0 xl:max-h-[calc(100vh-120px)] bg-[#FAF7FE] border border-purple-100 rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col gap-5 shadow-sm overflow-hidden">
        
        {/* Header containing comments title badge */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-neutral-800 font-bold text-lg flex items-center gap-2">
            კომენტარები
            {comments?.length > 0 && (
              <span className="bg-[#8338EC] text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                {comments.length}
              </span>
            )}
          </h3>
        </div>

        {/* Error handler log box */}
        {errors?.text?.message && (
          <p className="text-red-500 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 animate-pulse">
            {errors.text.message as string}
          </p>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(handleComment)}
          className="bg-white p-4 flex flex-col rounded-xl border border-neutral-200 shadow-inner focus-within:border-[#8338EC]/50 transition-colors flex-shrink-0"
        >
          <textarea
            {...register("text", {
              required: "კომენტარის ტექსტი აუცილებელია",
              minLength: {
                value: 2,
                message: "მინიმალური სიგრძეა 2 სიმბოლო",
              },
            })}
            className="w-full h-20 resize-none outline-none text-sm text-neutral-700 placeholder-neutral-400 leading-relaxed"
            placeholder="დაწერე კომენტარი..."
          />

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#7023db" }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer ml-auto mt-2 px-5 py-2 bg-[#8338EC] rounded-full text-white text-xs font-semibold shadow-sm transition-colors"
            type="submit"
          >
            დააკომენტარე
          </motion.button>
        </form>

        {/* Cleaned Inner Scroll Container - fills remaining height perfectly without duplicate scrollbars */}
        <div className="flex-1 overflow-y-auto pr-1 select-none custom-scrollbar">
          <Comments comments={comments} />
        </div>
      </section>
    </main>
  );
};

export default TaskDetails;