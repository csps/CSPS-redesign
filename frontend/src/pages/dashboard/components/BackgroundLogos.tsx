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

      {/* Large Center Logo 
          <img
            src={BACKGROUNDCSSLOGO}
            alt=""
            className="absolute top-[8rem] left-[20rem] -translate-x-1/2 opacity-70 z-10 
                       w-[22rem] sm:w-[28rem] md:w-[35rem] lg:w-[43rem]"
          />
            */}
    </>
  );
};

export default BackgroundLogos;
