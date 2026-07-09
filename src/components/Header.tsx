import { useNavigate } from "react-router-dom";
import { motion, easeOut } from "framer-motion";
import LogoutButton from "./LogoutButton";

interface HeaderProps {
  setCoworkerWindow: (v: boolean) => void;
}

const Header = ({ setCoworkerWindow }: HeaderProps) => {
  const navigate = useNavigate();

  // Animation variants for the container drop-down
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
      className="sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-5 px-6 md:px-16 py-5 bg-white/80 backdrop-blur-md border-b border-[#8338EC]/20 shadow-sm transition-all duration-300"
    >
      {/* Logo with slight hover lift & tap effect */}
      <motion.img
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer w-32 md:w-36 lg:w-auto object-contain"
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
            backgroundColor: "rgba(131, 56, 236, 0.05)",
            boxShadow: "0 4px 12px rgba(131, 56, 236, 0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCoworkerWindow(true)}
          className="cursor-pointer text-xs xl:text-base font-medium text-neutral-800 rounded-xl px-5 py-2.5 border border-[#8338EC] transition-colors duration-200"
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
          className="cursor-pointer text-xs xl:text-base font-medium text-white rounded-xl px-5 py-2.5 bg-[#8338EC] transition-colors duration-200"
        >
          + შექმენი ახალი დავალება
        </motion.button>
          
          <LogoutButton />

      </div>
    </motion.header>
  );
};

export default Header;