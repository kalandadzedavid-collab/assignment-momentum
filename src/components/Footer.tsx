import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-4 sm:px-6 md:px-10 pb-8 mt-auto max-w-[1600px] mx-auto select-none">
      {/* Exact Login Presentation Gradient & Styling */}
      <div className="w-full bg-gradient-to-r from-[#3A86FF] via-[#8338EC] to-[#FF006E] rounded-2xl p-6 md:p-7 shadow-xl shadow-purple-500/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle geometric dot pattern overlay from the login presentation screen */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* High-visibility glowing ambient blurs inside the footer card */}
        <div className="absolute top-[-50%] left-[-10%] w-72 h-72 rounded-full bg-white/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        {/* LEFT BLOCK: Brand Profile & Copyright with high contrast white text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-0.5 relative z-10">
          <div className="flex items-center gap-2 text-xl font-extrabold text-white tracking-wide drop-shadow-sm">
            Momentum <span className="text-base">⏳</span>
          </div>
          <p className="text-white/80 text-xs font-medium">
            &copy; {currentYear} ყველა უფლება დაცულია.
          </p>
        </div>

        {/* MIDDLE BLOCK: Clean Frosted Glass Status Badge */}
        <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-xl relative z-10 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          </span>
          <span className="text-white font-bold text-xs tracking-wide uppercase">
            სისტემა მუშაობს გამართულად (v2.0)
          </span>
        </div>

        {/* RIGHT BLOCK: High-Visibility Crispy Navigation Links */}
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
  className="text-white bg-transparent border-none p-0 drop-shadow-sm transition-opacity hover:opacity-90 cursor-pointer tracking-wide font-bold outline-none"
>
  API დოკუმენტაცია
</motion.button>

        

         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
