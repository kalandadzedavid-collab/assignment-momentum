import type { priorities } from "../types/types";

const DiffButton = ({ priority }: { priority: priorities }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all duration-300 select-none ${
        priority.name === "დაბალი"
          ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400"
          : priority.name === "საშუალო"
          ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
          : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
      }`}
    >
      <img 
        src={priority.icon} 
        alt="" 
        className="w-3.5 h-3.5 object-contain opacity-90 dark:brightness-110" 
      /> 
      <span>{priority.name}</span>
    </div>
  );
};

export default DiffButton;