import { useState, useRef, type ChangeEvent } from "react";
import { getData, postData } from "../../services/appApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { Inputs } from "../../types/types";

const EmployeeForm = ({ setCoworkerWindow }) => {
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
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();

    formData.append("name", data?.name);
    formData.append("surname", data?.surname);
    formData.append("avatar", data?.image[0]); // Transmits the actual image file
    // FIX: Convert it to a string for FormData.
    // The backend will automatically parse this back into a number (1) upon arrival.
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

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handle avatar selection and display preview
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Clear image preview and file value data safely
  const handleDeleteAvatar = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation(); // Stops the container click event from re-opening file selection
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 w-screen h-screen bg-neutral-950/20 backdrop-blur-[5px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white py-15 px-12.5 rounded-2xl max-w-4xl w-full mx-4"
      >
        {/* Close Button */}
        <img
          onClick={() => setCoworkerWindow(false)}
          className="justify-self-end mb-10 cursor-pointer"
          src="./icons/Cancel.svg"
          alt="cancel"
        />

        {/* Form Title */}
        <h2 className="text-neutral-800 text-3xl font-medium mb-10.5 text-center">
          თანამშრომლის დამატება
        </h2>

        {/* Input Fields Row */}
        <div className="flex gap-11.5 mb-11.5">
          {/* First Name Field */}
          <label className="flex flex-col" htmlFor="name">
            <p className="text-neutral-700 text-sm font-medium">სახელი*</p>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name can only contain letters and spaces",
                },
              })}
              className="w-91.25 p-2.5 bg-white rounded-md outline -outline-offset-1 outline-gray-300"
              type="text"
              id="name"
            />
            <p className="mt-2 flex text-gray-500 text-[10px]">
              <img className="mr-1" src="./icons/check.svg" alt="" /> მინიმუმ 2
              სიმბოლო
            </p>
            <p className="text-red-600">
              {errors?.name && errors.name.message}
            </p>
          </label>

          {/* Last Name Field */}
          <label className="flex flex-col" htmlFor="surname">
            <p className="text-neutral-700 text-sm font-medium">გვარი*</p>
            <input
              {...register("surname", {
                required: "Surname is required",
                minLength: {
                  value: 2,
                  message: "Surname must be at least 2 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s'-]+$/,
                  message:
                    "Surname can only contain letters, spaces, hyphens, or apostrophes",
                },
              })}
              className="w-91.25 p-2.5 bg-white rounded-md outline -outline-offset-1 outline-gray-300"
              type="text"
              id="surname"
            />
            <p className="mt-2 flex text-gray-500 text-[10px]">
              <img className="mr-1" src="./icons/check.svg" alt="" /> მინიმუმ 2
              სიმბოლო
            </p>
            <p className="text-red-600">
              {errors?.surname && errors.surname.message}
            </p>
          </label>
        </div>

        {/* --- AVATAR UPLOADER FIELD --- */}
        <div>
          <label className="block text-neutral-700 text-sm font-medium mb-2">
            ავატარი*
          </label>
          <div
            onClick={() =>
              !imagePreview && document.getElementById("avatar-upload")?.click()
            }
            className={`relative w-full h-30 border border-dashed border-gray-300 rounded bg-white flex items-center justify-center ${
              !imagePreview
                ? "cursor-pointer hover:bg-gray-50/50 transition-colors"
                : ""
            }`}
          >
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image", {
                required: "An image is required",
                onChange: (e) => handleFileChange(e), // Handled safely inside RHF
              })}
            />

            {/* Upload Icon Placeholder (Visible only when empty) */}
            {!imagePreview && (
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <svg
                  className="w-8 h-8 text-gray-400 mb-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-xs text-gray-400">სურათის ატვირთვა</span>
              </div>
            )}

            {/* Avatar Preview Display */}
            {imagePreview && (
              <div className="relative w-20 h-20">
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-full h-full rounded-full object-cover border border-gray-200"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Stops the div from triggering a click event
                    handleDeleteAvatar(e);
                  }}
                  title="Delete image"
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            )}
          </div>
          {errors?.image && (
            <p className="text-red-600 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>
        {/* --- END OF AVATAR UPLOADER FIELD --- */}
        <label
          className="text-neutral-700
text-sm
font-medium"
          htmlFor="departments"
        >
          <p className="mt-10 mb-1 ">დეპარტამენტი*</p>
          <select
            className="h-10 p-2.5 bg-white rounded-md outline -outline-offset-1 outline-gray-300 w-91.25"
            id="departments"
            {...register("department_id", { required: "Choose one" })}
          >
            <option value=""></option>
            {departments &&
              departments.map((depart: { id: number; name: string }) => {
                return (
                  <option key={depart?.id} value={depart?.id}>
                    {depart?.name}
                  </option>
                );
              })}
          </select>
          {errors?.department_id && (
            <p className="text-red-600 text-xs mt-1">
              {errors.department_id.message}
            </p>
          )}
        </label>
        <div className="w-full flex gap-5 justify-end mt-11">
          <button
            onClick={() => setCoworkerWindow(false)}
            type="button"
            className="cursor-pointer px-4 py-2.5 rounded-[5px] outline -outline-offset-1 outline-violet-600 text-[#343A40]
text-base
font-normal"
          >
            გაუქმება
          </button>
          <button
            className="cursor-pointer text-white px-5 py-2.5 bg-violet-600 rounded-[5px]"
            type="submit"
          >
            დაამატე თანამშრომელი
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
