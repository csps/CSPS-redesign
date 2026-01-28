const Activities = () => {
  return (
    <div>
      <div className="w-full flex justify-between mb-5">
        <p className="md:text-xl lg:text-4xl font-semibold">Activities</p>
        <p className="text-xs mt-[.3rem] lg:text-lg font-semibold">Read more</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
        {/* First big slide */}
        <div className="w-full h-[665px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
          <div className="w-full h-full border-b-2 border-t-2 border-[#727272] rounded-3xl flex justify-center items-center">
            slide
          </div>
        </div>

        {/* Second big slide */}
        <div className="w-full h-[665px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
          <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl flex justify-center items-center">
            slide
          </div>
        </div>

        {/* Third column stacked */}
        <div className="w-full space-y-8">
          <div className="h-[315px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
            <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl flex justify-center items-center">
              slide
            </div>
          </div>
          <div className="h-[315px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
            <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl flex justify-center items-center">
              slide
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
