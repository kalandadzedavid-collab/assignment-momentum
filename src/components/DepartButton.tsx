import type { departments } from "../types/types";

const DepartButton = ({ depart }: { depart: departments }) => {
  return (
    <button
      className={`text-white text-xs
font-normal px-2 py-1.25 bg-pink-400 rounded-2xl ${
        depart.id === 1
          ? "bg-blue-500"
          : depart.id === 2
          ? "bg-emerald-500"
          : depart.id === 3
          ? "bg-violet-500"
          : depart.id === 4
          ? "bg-amber-500"
          : depart.id === 5
          ? "bg-rose-500"
          : depart.id === 6
          ? "bg-cyan-500"
          : depart.id === 7
          ? "bg-fuchsia-500"
          : depart.id === 8
          ? "bg-orange-500"
          : "bg-slate-500"
      }`}
    >
      {depart.id === 1
        ? "ადმინისტრაცია"
        : depart.id === 2
        ? "HR / რესურსები"
        : depart.id === 3
        ? "ფინანსები"
        : depart.id === 4
        ? "გაყიდვები & მარკეტინგი"
        : depart.id === 5
        ? "ლოჯისტიკა"
        : depart.id === 6
        ? "ტექნოლოგიები"
        : depart.id === 7
        ? "მედია"
        : depart.id === 8
        ? "დიზაინი"
        : depart.name}
    </button>
  );
};

export default DepartButton;
