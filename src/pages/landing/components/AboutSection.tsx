import LAPTOPICON from "../../../assets/icons/laptop.svg";
import RAINBOWICON from "../../../assets/icons/rainbow.svg";
import ROCKETICON from "../../../assets/icons/rocket.svg";
import DeanAdviserSection from "./DeanAdviserSection";

const AboutSection = ({ refer }: {refer: React.RefObject<HTMLDivElement>}) => {
  return (
    <div className="w-full" ref={refer}>
      <div className="space-y-5">
        <p className="text-5xl font-semibold">Get to know CSP-S</p>
        <p className="md:w-[20rem] text-lg">
          Discover who we are and what we aspire.
        </p>
      </div>
          <DeanAdviserSection />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 py-10">
        <div className="border-t-2 border-b-2 border-gray-600  rounded-md space-y-10 py-5">
          <div className="flex items-center justify-evenly gap-5">
            <img src={LAPTOPICON} alt="LAPTAP" />
            <p className="text-3xl">Who we are</p>
          </div>
          <p className="px-10 py-3 text-base/6">
            We are the Computing Society of the Philippines - Students, an
            organization led by students for all computer science students, at
            the University of Cebu main campus.
          </p>
        </div>
        <div className="border-t-2 border-b-2 border-gray-600  rounded-md space-y-10 py-5">
          <div className="flex items-center justify-evenly gap-5">
            <img src={RAINBOWICON} alt="RAINBAW" />
            <p className="text-3xl">Our Mission</p>
          </div>
          <p className="px-10 py-3 text-base/6">
            Fostering an inclusive, diverse, and supportive community in the
            world of computing.
          </p>
        </div>
        <div className="border-t-2 border-b-2 border-gray-600  rounded-md space-y-10 py-5">
          <div className="flex items-center justify-evenly gap-5">
            <img src={ROCKETICON} alt="RACKET" />
            <p className="text-3xl">Why join us</p>
          </div>
          <div className="px-10 py-3 text-base/6">
            <li>Meet like-minded CS peers</li>
            <li>Explore your tech interests</li>
            <li>Grow academically and professionally</li>
          </div>
        </div>
      </div>
      <p className="mt-20 w-full md:px-18 md:text-3xl  text-center ">
        Join CSP-S and grow with a community that celebrates diversity and
        supports your journey. And we will welcome you with open arms.
      </p>
    </div>
  );
};

export default AboutSection;
