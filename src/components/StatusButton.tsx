const StatusButton = ({ status, color }: { status: string; color: string }) => {
  return (
    <button
      className={`${color} w-95.25 py-3.5 rounded-[10px] text-white text-xl font-medium`}
    >
      {status}
    </button>
  );
};

export default StatusButton;
