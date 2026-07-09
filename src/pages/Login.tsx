import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [statsCounter, setStatsCounter] = useState(1420);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatsCounter((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  function handleSub(data: { name: string; password: string }) {
    setLoginError(null);

    if (data.name === "admin" && data.password === "admin123") {
      localStorage.setItem("login", "true");
      navigate("/");
    } else {
      setLoginError("მომხმარებლის სახელი ან პაროლი არასწორია.");
    }
  }

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden font-sans">
      {/* LEFT COLUMN: Form Interface (Gets presentation gradient background on mobile) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 sm:p-8 md:p-12 bg-gradient-to-tr from-[#3A86FF] via-[#8338EC] to-[#FF006E] lg:from-transparent lg:via-transparent lg:to-transparent lg:bg-[#FAF7FE] relative z-10">
        {/* Mobile Background Texture Effects (Only visible on screens smaller than lg) */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] lg:hidden" />
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-white/10 blur-[80px] lg:hidden" />

        {/* Desktop Ambient Blur Mesh (Only visible on desktop) */}
        <div className="hidden lg:block absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-[120px] pointer-events-none" />
        <div className="hidden lg:block absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-200/20 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px] bg-white rounded-2xl border border-purple-100/80 lg:border-purple-100 p-8 shadow-2xl lg:shadow-xl relative z-10"
        >
          {/* Logo and Header Group */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 text-3xl font-bold text-neutral-800 tracking-tight">
              Momentum <span className="text-2xl animate-bounce">⏳</span>
            </div>
            <h2 className="text-neutral-400 text-sm font-medium mt-2">
              ავტორიზაცია პანელში
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(handleSub)}
            className="flex flex-col gap-5"
          >
            {/* Global Credentials Error Banner */}
            {loginError && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100 text-center"
              >
                {loginError}
              </motion.p>
            )}

            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-neutral-700 text-sm font-medium pl-1"
              >
                მომხმარებლის სახელი *
              </label>
              <input
                {...register("name", {
                  required: "სახელის შეყვანა აუცილებელია",
                })}
                type="text"
                id="username"
                autoComplete="username"
                placeholder="admin"
                className={`w-full h-11 px-4 bg-white border ${
                  errors.name
                    ? "border-red-400 focus:ring-red-500/10"
                    : "border-neutral-200 focus:border-[#8338EC] focus:ring-[#8338EC]/10"
                } rounded-xl text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:outline-none focus:ring-4`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 pl-1 font-medium mt-0.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-neutral-700 text-sm font-medium pl-1"
              >
                პაროლი *
              </label>
              <input
                {...register("password", {
                  required: "პაროლის შეყვანა აუცილებელია",
                })}
                type="password"
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full h-11 px-4 bg-white border ${
                  errors.password
                    ? "border-red-400 focus:ring-red-500/10"
                    : "border-neutral-200 focus:border-[#8338EC] focus:ring-[#8338EC]/10"
                } rounded-xl text-sm font-medium text-neutral-800 placeholder-neutral-400 transition-all focus:outline-none focus:ring-4`}
              />
              {errors.password && (
                <p className="text-xs text-red-500 pl-1 font-medium mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Interactive Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: "#7023db" }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full h-11 mt-2 bg-[#8338EC] text-white rounded-xl text-sm font-semibold shadow-md shadow-purple-500/10 transition-colors cursor-pointer flex items-center justify-center"
            >
              შესვლა
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: Premium Presentation Screen (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-tr from-[#3A86FF] via-[#8338EC] to-[#FF006E] relative items-center justify-center p-16 overflow-hidden">
        {/* Futuristic abstract geometry backdrops */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-[-30%] right-[-20%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="relative text-white z-10 flex flex-col max-w-xl text-left"
        >
          {/* Animated Product Showcase Slide */}
          <span className="bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase w-fit border border-white/10 mb-6">
            ✨ ვერსია 2.0 პრეზენტაცია
          </span>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6">
            მართე დავალებები <br /> მარტივად და სწრაფად.
          </h1>

          <p className="text-white/80 text-lg font-light leading-relaxed mb-10">
            ინტუიციური Kanban დაფა, დეტალური სტატისტიკა და გუნდური კომუნიკაციის
            ცენტრი გაერთიანებული ერთ სივრცეში.
          </p>

          {/* Flashy Analytics Card Mockup */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl flex items-center gap-6"
          >
            <div className="p-4 bg-white rounded-xl text-[#8338EC] text-2xl shadow-md">
              📊
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                დასრულებული სამუშაო
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-bold tracking-tight">
                  {statsCounter}
                </span>
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-0.5">
                  ▲ +12%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
