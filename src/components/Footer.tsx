import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-4 sm:px-6 md:px-10 pb-8 mt-auto max-w-[1600px] mx-auto select-none transition-all duration-300">
      {/* Container: Changed to an ultra-clean charcoal color matching the app grid with a beautiful brand gradient top hairline bar */}
      <div className="w-full bg-white dark:bg-[#222533] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all duration-300">
        
        {/* Decorative Brand Accent Line on top of the footer card */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#3A86FF] via-[#8338EC] to-[#FF006E]" />

        {/* LEFT BLOCK: Text color adapts from dark neutral to sharp off-white */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-0.5 relative z-10">
          <div className="flex items-center gap-2 text-xl font-extrabold text-neutral-800 dark:text-neutral-100 tracking-wide transition-colors">
            Momentum <span className="text-base">⏳</span>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium transition-colors">
            &copy; {currentYear} ყველა უფლება დაცულია.
          </p>
        </div>

        {/* MIDDLE BLOCK: Clean Frosted Glass Status Badge built to work seamlessly across light and gray themes */}
        <div className="flex items-center gap-3 bg-neutral-50 dark:bg-[#2A2D3E] border border-neutral-200/60 dark:border-neutral-700/60 px-5 py-2.5 rounded-xl relative z-10 shadow-sm transition-colors">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
          </span>
          <span className="text-neutral-700 dark:text-neutral-200 font-bold text-xs tracking-wide uppercase transition-colors">
            სისტემა მუშაობს გამართულად (v2.0)
          </span>
        </div>

        {/* RIGHT BLOCK: Interactive Nav Links with light/dark adaptive layout styles */}
        <div className="flex items-center gap-5 text-xs font-bold relative z-10">
          <motion.button
            whileHover={{ y: -1.5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={(e) => {
              e.preventDefault();       // 1. Stops a parent <Link> from changing the route
              e.stopPropagation();      // 2. Stops the event from bubbling up the DOM tree
              
              // 3. Force opens the tab directly via native browser API
              window.open(
                "https://momentum.redberryinternship.ge/scalar#tag/statuses", 
                "_blank", 
                "noopener,noreferrer"
              );
            }}
            type="button"
            className="text-neutral-600 dark:text-neutral-300 bg-transparent border-none p-0 transition-colors hover:text-[#8338EC] dark:hover:text-purple-400 cursor-pointer tracking-wide font-bold outline-none"
          >
            API დოკუმენტაცია
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;