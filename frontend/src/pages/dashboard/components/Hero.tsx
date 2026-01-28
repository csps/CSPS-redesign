import BACKGROUNDCSSLOGO from "../../../assets/logos/Background_Logo.png";
import { useAuthStore } from "../../../store/auth_store";
import type { StudentResponse } from "../../../interfaces/student/StudentResponse";

const Hero = () => {
  // get student info from auth store
  const student = useAuthStore((state) => state.user as StudentResponse).user;

  const fullName = `${student.firstName} ${
    student.middleName ? `${student.middleName.charAt(0)}.` : ""
  } ${student.lastName}`;

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start">
      {/* Left */}
      <div className="relative flex justify-center md:justify-start w-full md:w-1/2">
        <img
          src={BACKGROUNDCSSLOGO}
          alt=""
          className="
                    object-contain
                    
                    py-22
                    absolute
                "
        />
      </div>

      {/* Right */}
      <div className="flex justify-center md:justify-start  flex-col w-full md:w-1/2 text-center md:text-left mt-36 md:mt-0 py-[14rem]">
        <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-semibold">
          Welcome Back
        </h1>
        <h2 className="px-4 sm:px-6 md:px-10 text-3xl sm:text-4xl md:text-4xl lg:text-6xl text-[#FDE006] font-semibold mt-3 md:mt-5">
          {fullName}
        </h2>
      </div>
    </div>
  );
};

export default Hero;
