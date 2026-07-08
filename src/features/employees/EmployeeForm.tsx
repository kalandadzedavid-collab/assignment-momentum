import { useState, type ChangeEvent } from "react";
import { getData, postData } from "../../services/appApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Inputs } from "../../types/types";

const EmployeeForm = ({
  setCoworkerWindow,
}: {
  setCoworkerWindow: (v: boolean) => void;
}) => {
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getData("departments"),
  });

  const addWorker = useMutation({
    mutationFn: (data: FormData) => postData("employees", data),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  // Custom dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{ id: number; name: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.append("name", data?.name);
    formData.append("surname", data?.surname);
    formData.append("avatar", data?.image[0]);
    formData.append("department_id", String(data?.department_id));

    addWorker.mutate(formData, {
      onSuccess: () => {
        setCoworkerWindow(false);
        navigate("/");
      },
      onError: (err) => {
        console.error("Mutation error:", err);
      },
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleDeleteAvatar = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setImagePreview(null);
    const inputEl = document.getElementById("avatar-upload") as HTMLInputElement | null;
    if (inputEl) inputEl.value = "";
  };

  return (
    // Backdrop animation layer (Ensured z-[100] to overlay the Header safely)
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 z-[100] flex justify-center items-center fixed inset-0 w-screen h-screen bg-neutral-950/40 backdrop-blur-sm"
    >
      {/* Modal Card wrapper with a premium spring entry animation */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
        className="bg-white py-8 px-6 md:px-12 rounded-2xl max-w-2xl w-full shadow-2xl relative border border-neutral-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button Cross */}
        <button 
          type="button"
          onClick={() => setCoworkerWindow(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Form Title */}
        <h2 className="text-neutral-800 text-xl md:text-2xl font-semibold mb-8 text-center">
          თანამშრომლის დამატება
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Input Fields Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-sm font-medium" htmlFor="name">
                სახელი*
              </label>
              <input
                {...register("name", {
                  required: "სახელი სავალდებულოა",
                  minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                  pattern: { value: /^[A-Za-z\s\u10A0-\u10FF]+$/, message: "გამოიყენეთ მხოლოდ ასოები" },
                })}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl focus:border-[#8338EC] focus:ring-2 focus:ring-[#8338EC]/20 outline-none transition-all duration-200"
                type="text"
                id="name"
                placeholder="სახელი"
              />
              <p className="flex items-center text-neutral-400 text-[11px] gap-1">
                <img className="w-3.5 h-3.5" src="/icons/check.svg" alt="" /> მინიმუმ 2 სიმბოლო
              </p>
              {errors?.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            {/* Last Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-700 text-sm font-medium" htmlFor="surname">
                გვარი*
              </label>
              <input
                {...register("surname", {
                  required: "გვარი სავალდებულოა",
                  minLength: { value: 2, message: "მინიმუმ 2 სიმბოლო" },
                  pattern: { value: /^[A-Za-z\s'\-\u10A0-\u10FF]+$/, message: "გამოიყენეთ მხოლოდ ასოები" },
                })}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl focus:border-[#8338EC] focus:ring-2 focus:ring-[#8338EC]/20 outline-none transition-all duration-200"
                type="text"
                id="surname"
                placeholder="გვარი"
              />
              <p className="flex items-center text-neutral-400 text-[11px] gap-1">
                <img className="w-3.5 h-3.5" src="/icons/check.svg" alt="" /> მინიმუმ 2 სიმბოლო
              </p>
              {errors?.surname && <p className="text-red-500 text-xs">{errors.surname.message}</p>}
            </div>
          </div>

          {/* Avatar Uploader Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-700 text-sm font-medium">
              ავატარი*
            </label>
            <div
              onClick={() => !imagePreview && document.getElementById("avatar-upload")?.click()}
              className={`relative w-full h-32 border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-200 ${
                !imagePreview
                  ? "border-neutral-300 bg-neutral-50/50 cursor-pointer hover:bg-neutral-50 hover:border-[#8338EC]/50"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                {...register("image", {
                  required: "სურათის ატვირთვა სავალდებულოა",
                  onChange: (e) => handleFileChange(e),
                })}
              />

              {!imagePreview ? (
                <div className="flex flex-col items-center justify-center pointer-events-none gap-1">
                  <svg className="w-7 h-7 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-xs font-medium text-neutral-500">სურათის ატვირთვა</span>
                </div>
              ) : (
                <div className="relative w-20 h-20 group">
                  <img
                    src={imagePreview}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover border border-neutral-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 text-neutral-500 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {errors?.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}
          </div>

          {/* Premium Custom Department Select Dropdown */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-neutral-700 text-sm font-medium" htmlFor="departments">
              დეპარტამენტი*
            </label>

            {/* Hidden field syncing native RHF validation with our beautiful custom dropdown UI */}
            <input
              type="hidden"
              {...register("department_id", { required: "აირჩიეთ დეპარტამენტი" })}
              value={selectedDepartment?.id || ""}
            />

            {/* Dropdown Action Trigger Trigger */}
            <button
              id="departments"
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-xl outline-none transition-all duration-200 text-left ${
                isDropdownOpen 
                  ? "border-[#8338EC] ring-2 ring-[#8338EC]/20" 
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
            >
              <span className={selectedDepartment ? "text-neutral-800 font-normal" : "text-neutral-400"}>
                {selectedDepartment ? selectedDepartment.name : "აირჩიეთ დეპარტამენტი"}
              </span>
              
              {/* Spinning Chevron arrow icon indicating interaction states */}
              <motion.svg
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-5 h-5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            {/* Floating Options List Container */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute z-[110] left-0 right-0 top-[calc(100%+4px)] bg-white border border-neutral-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1.5 overflow-hidden"
                >
                  {departments && departments.length > 0 ? (
                    departments.map((depart: { id: number; name: string }) => {
                      const isSelected = selectedDepartment?.id === depart.id;
                      return (
                        <motion.li
                          whileHover={{ backgroundColor: "rgba(131, 56, 236, 0.06)" }}
                          key={depart.id}
                          onClick={() => {
                            setSelectedDepartment(depart);
                            setValue("department_id", depart.id, { shouldValidate: true });
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected 
                              ? "text-[#8338EC] font-medium bg-[#8338EC]/5" 
                              : "text-neutral-700 font-normal"
                          }`}
                        >
                          <span>{depart.name}</span>
                          {isSelected && (
                            <svg className="w-4 h-4 text-[#8338EC]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </motion.li>
                      );
                    })
                  ) : (
                    <li className="px-4 py-3 text-sm text-neutral-400 text-center">დეპარტამენტები ვერ მოიძებნა</li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>

            {errors?.department_id && <p className="text-red-500 text-xs">{errors.department_id.message}</p>}
          </div>

          {/* Form Actions Footer */}
          <div className="w-full flex gap-4 justify-end pt-4 border-t border-neutral-100">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCoworkerWindow(false)}
              type="button"
              className="cursor-pointer px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-base font-medium transition-colors"
            >
              გაუქმება
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#7023db", boxShadow: "0 4px 15px rgba(131, 56, 236, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer text-white px-6 py-2.5 bg-[#8338EC] rounded-xl font-medium text-base transition-colors"
              type="submit"
            >
              დაამატე თანამშრომელი
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeForm;