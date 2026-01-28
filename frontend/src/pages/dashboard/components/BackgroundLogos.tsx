import BACKGROUNDCSSLOGO from "../../../assets/logos/Background_Logo.png";

const BackgroundLogos = () => {
  return (
    <>
      {/* Background Logos */}
      <img
        src={BACKGROUNDCSSLOGO}
        alt=""
        className="absolute top-0 left-[-5rem] sm:left-[-10rem] lg:left-0 opacity-40 w-[10rem] sm:w-[15rem] lg:w-[20rem]"
      />
      <img
        src={BACKGROUNDCSSLOGO}
        alt=""
        className="absolute top-[8rem] left-[10%] sm:left-[30%] lg:left-[37rem] opacity-40 w-[8rem] sm:w-[12rem] lg:w-[15rem]"
      />
      <img
        src={BACKGROUNDCSSLOGO}
        alt=""
        className="absolute top-[12rem] right-[5%] sm:right-[10%] lg:left-[70rem] opacity-40 w-[12rem] sm:w-[18rem] lg:w-[25rem]"
      />

      {/* Large Center Logo 
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[8rem] left-[20rem] -translate-x-1/2 opacity-70 z-10 
                       w-[22rem] sm:w-[28rem] md:w-[35rem] lg:w-[43rem]"
          />
            */}
      <img
        src={BACKGROUNDCSSLOGO}
        alt=""
        className="absolute top-[26rem] left-[15%] sm:left-[-2rem] opacity-20 w-[10rem] sm:w-[15rem] lg:w-[20rem]"
      />
      <img
        src={BACKGROUNDCSSLOGO}
        alt=""
        className="invisible md:visible absolute top-[28rem] right-[10%] sm:right-[20%] lg:left-[56rem] opacity-40 w-[12rem] sm:w-[16rem] lg:w-[20rem]"
      />
      <img
        src={BACKGROUNDCSSLOGO}
        alt=""
        className=" absolute top-[32rem] left-[20%] sm:left-[25%] lg:left-[23rem] opacity-20 w-[15rem] sm:w-[20rem] lg:w-[25rem]"
      />
    </>
  );
};

export default BackgroundLogos;
