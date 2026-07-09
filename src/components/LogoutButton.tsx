import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/login"); // Redirects to the login page after clearing storage
  };

  // Detect if dark mode is active to apply correct Framer Motion animation colors
  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02, 
        backgroundColor: isDarkMode ? "rgba(153, 27, 27, 0.2)" : "#FEF2F2" 
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="cursor-pointer px-5 py-2 border border-red-200 dark:border-red-900/30 text-red-500 rounded-xl text-sm font-medium transition-colors hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-900/20 flex items-center gap-1.5"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      გასვლა
    </motion.button>
  );
};

export default LogoutButton;