import { useNavigate } from "react-router-dom";

const Header = ({ setCoworkerWindow }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-30 py-7.75 border-b border-b-[#8338EC]">
      <img
        className="cursor-pointer"
        onClick={() => navigate("/")}
        src="./icons/logo.svg"
        alt="logo"
      />
      <div className="flex gap-5">
        <button
          onClick={() => setCoworkerWindow(true)}
          className="cursor-pointer text-neutral-800
text-base
font-normal rounded-xl px-5 py-2.5 outline outline-[#8338EC]"
        >
          თანამშრომლის შექმნა
        </button>
        <button onClick={() => navigate("/create+task")}
          className="cursor-pointer text-base
font-normal text-white rounded-xl px-5 py-2.5 bg-[#8338EC]"
        >
          + შექმენი ახალი დავალება
        </button>
      </div>
    </header>
  );
};

export default Header;
