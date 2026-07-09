import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // Redirects to the login page after clearing storage
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "#FEF2F2" }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="cursor-pointer px-5 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-medium transition-colors hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-500/10 flex items-center gap-1.5"
    >
      {/* Optional: Clean generic logout power icon */}
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