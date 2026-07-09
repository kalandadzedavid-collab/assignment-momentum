const StatusButton = ({ status, color }: { status: string; color: string }) => {
  // Direct matching based on the column status text to guarantee unique colors
  const getDarkModeColors = (statusText: string) => {
    const txt = statusText.trim();

    // 1. დასაწყები (To Do) -> Crisp Blue Accent
    if (txt === "დასაწყები") {
      return "dark:bg-[#3A86FF]/10 dark:text-[#4da3ff] dark:border-[#3A86FF]/40";
    }
    // 2. პროგრესში (In Progress) -> Royal Violet Accent
    if (txt === "პროგრესში") {
      return "dark:bg-[#8338EC]/10 dark:text-[#be92ff] dark:border-[#8338EC]/40";
    }
    // 3. მზად ტესტირებისთვის (Ready for Test) -> Vibrant Pink Accent
    if (txt === "მზად ტესტირებისთვის") {
      return "dark:bg-[#FF006E]/10 dark:text-[#ff4da6] dark:border-[#FF006E]/40";
    }
    // 4. დასრულებული (Done) -> Sunny Amber Accent
    if (txt === "დასრულებული") {
      return "dark:bg-[#FFBE0B]/10 dark:text-[#ffca28] dark:border-[#FFBE0B]/40";
    }

    // Fallback default
    return "dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40";
  };

  const darkColors = getDarkModeColors(status);

  return (
    <div
      className={`${color} ${darkColors} w-[380px] px-4 py-2.5 sm:py-3.5 rounded-[10px] text-white text-center text-sm sm:text-base md:text-lg lg:text-xl font-medium border dark:border-solid transition-all duration-300 select-none cursor-default`}
    >
      {status}
    </div>
  );
};

export default StatusButton;
