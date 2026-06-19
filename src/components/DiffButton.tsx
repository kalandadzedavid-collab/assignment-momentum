const DiffButton = ({ priority }) => {
  return (
    <button
      className={`flex items-center gap-2 text-xs
font-medium p-1 bg-white rounded-sm outline ${
        priority.name == "დაბალი"
          ? "outline-green-700 text-green-700"
          : priority.name == "საშუალო"
          ? "outline-yellow-400 text-yellow-400"
          : "outline-red-500 text-red-500"
      }`}
    >
      <img src={priority.icon} alt="" /> {priority.name}
    </button>
  );
};

export default DiffButton;
