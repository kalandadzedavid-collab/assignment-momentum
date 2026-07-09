import { useNavigate } from "react-router-dom";
import { motion, easeOut, AnimatePresence } from "framer-motion";
import LogoutButton from "./LogoutButton";
import { useThemeStore } from "../stores/useThemeStore"; // Path matches your stores folder

interface HeaderProps {
  setCoworkerWindow: (v: boolean) => void;
}

const Header = ({ setCoworkerWindow }: HeaderProps) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: easeOut }
    }
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className="sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-5 px-6 md:px-16 py-5 bg-white/80 dark:bg-[#1E202B]/80 backdrop-blur-md border-b border-[#8338EC]/20 dark:border-[#8338EC]/30 shadow-sm transition-all duration-300"
    >
      {/* Logo with slight hover lift & tap effect */}
      <motion.img
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer w-32 md:w-36 lg:w-auto object-contain dark:brightness-110"
        onClick={() => navigate("/")}
        src="/icons/logo.svg"
        alt="logo"
      />

      {/* Buttons Container */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full md:w-auto justify-center md:justify-end">
        
       

        {/* Secondary Button: Create Coworker */}
        <motion.button
          whileHover={{ 
            scale: 1.02, 
            backgroundColor: theme === "light" ? "rgba(131, 56, 236, 0.05)" : "rgba(131, 56, 236, 0.15)",
            boxShadow: "0 4px 12px rgba(131, 56, 236, 0.15)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCoworkerWindow(true)}
          className="cursor-pointer text-xs xl:text-base font-medium text-neutral-800 dark:text-purple-100 rounded-xl px-5 py-2.5 border border-[#8338EC] transition-colors duration-200 w-full md:w-auto"
        >
          თანამშრომლის შექმნა
        </motion.button>

        {/* Primary Button: Create Task */}
        <motion.button
          whileHover={{ 
            scale: 1.02, 
            backgroundColor: "#7023db", 
            boxShadow: "0 6px 20px rgba(131, 56, 236, 0.3)" 
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/create+task")}
          className="cursor-pointer text-xs xl:text-base font-medium text-white rounded-xl px-5 py-2.5 bg-[#8338EC] transition-all duration-200 w-full md:w-auto"
        >
          + შექმენი ახალი დავალება
        </motion.button>

         {/* Animated Light/Dark Mode Switcher */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: theme === "light" ? "#FAF7FE" : "#1A0F2B" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          type="button"
          className="cursor-pointer flex items-center justify-center w-10 h-10 border border-purple-200 dark:border-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400 bg-transparent transition-colors duration-200 outline-none"
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "light" ? (
              // Sun Icon
              <motion.svg
                key="sun"
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </motion.svg>
            ) : (
              // Moon Icon
              <motion.svg
                key="moon"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
          
        <LogoutButton />

      </div>
    </motion.header>
  );
};

export default Header;