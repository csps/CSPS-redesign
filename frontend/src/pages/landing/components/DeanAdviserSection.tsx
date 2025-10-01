import DEAN1 from "../../../assets/Dean/Dean 2.png";
import DEAN2 from "../../../assets/Dean/Dean 2(1).png";
import ExpandableButton from "../../../components/ExpandableButton";

const DeanAdviserSection = () => {
  return (
    <div className="w-full mt-56">
      <div className="space-y-5">
        <p className="text-5xl font-semibold text-[#FDE006]">
          Meet our dean and adviser
        </p>
        <p className="md:w-[30rem] text-lg">
          Discover the guidance and vision that drive your academic and
          professional development.
        </p>
      </div>
      <div className="flex flex-wrap gap-20 py-10 w-full  justify-center">
        <div className="w-96 relative">
          <img src={DEAN1} alt="DEAN" className="h-full rounded-3xl " />
          <div className="absolute bottom-0 w-full h-20  max-w-sm p-4 rounded-b-3xl bg-gradient-to-r from-[#141414]/60 via-[#1c1c1c]/60 to-[#222222]/60 backdrop-blur-[6px] shadow-lg text-white py-2">
            <p className="font-semibold">Heubert Martinez Ferolino, MSTCS</p>
            <p className="text-sm text-[#FFFFFF]">
              Dean, College of Computer Studies UC main campus
            </p>
            <ExpandableButton className=" bottom-14 right-5" />
          </div>
        </div>
        <div className="w-96 relative">
          <img src={DEAN2} alt="DEAN" className="h-full rounded-3xl " />
          <div className="absolute bottom-0 w-full h-20  max-w-sm p-4 rounded-b-3xl bg-gradient-to-r from-[#141414]/60 via-[#1c1c1c]/60 to-[#222222]/60 backdrop-blur-[6px] shadow-lg text-white py-2">
            <p className="font-semibold">Neil A. Basabe, MIT</p>
            <p className="text-sm text-[#FFFFFF]">
              Dean, College of Computer Studies UC main campus
            </p>
            <ExpandableButton className=" bottom-14 right-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeanAdviserSection;
