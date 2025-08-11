import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import EastIcon from "@mui/icons-material/East";
import Logo from "@/assets/CSPS_LOGO.png";

const RecentActivites = () => {
  return (
    <div className="w-full ">
      <div className="text-center w-full">
        <p className="text-6xl font-semibold text-white mb-10">
          Recent Activities
        </p>
      </div>
      <div className="min-h-[500px] space-y-20">
        {[1, 2, 3].map((num, index) =>
          index % 2 === 1 ? (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-2"
            >
              <div className="flex-1 px-5 text-white space-y-5">
                <p className="text-5xl font-bold">Event Name</p>
                <div className="px-8 font-bold">
                  <p className="line-clamp-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Fusce a porttitor turpis. Pellentesque ut metus fermentum
                    risus laoreet fringilla ultricies eu mi. Sed porttitor quam
                    hendrerit sapien volutpat accumsan. Proin dictum sed ligula
                    cursus egestas. Etiam at fringilla quam. Vivamus at nibh
                    malesuada, efficitur ante vel, lacinia enim. Ut vel justo
                    odio. Pellentesque nec aliquam odio. Nulla luctus congue
                    enim vitae dignissim. Aliquam vitae interdum dolor. Nunc non
                    facilisis dui, eu porta nisi. Etiam ac augue eu risus
                    placerat facilisis. In hac habitasse platea dictumst.
                    Phasellus sed maximus quam. Vestibulum non interdum risus,
                    nec venenatis nibh. Aenean iaculis nulla in lobortis
                    condimentum.
                  </p>
                </div>
                <p className="text-xl text-[#FFC300] font-bold cursor-pointer hover:underline">
                  See more <EastIcon />
                </p>
              </div>
              <GlassmorphismCard borderRadius={20} glassCard={2}>
                <img src={Logo} alt="sample-image" />
              </GlassmorphismCard>
            </div>
          ) : (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-2"
            >
              <GlassmorphismCard borderRadius={20} glassCard={2}>
                <img src={Logo} alt="sample-image" />
              </GlassmorphismCard>
              <div className="flex-1 px-5 text-white space-y-5">
                <p className="text-5xl font-bold">Event Name</p>
                <div className="px-8 font-bold">
                  <p className=" line-clamp-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Fusce a porttitor turpis. Pellentesque ut metus fermentum
                    risus laoreet fringilla ultricies eu mi. Sed porttitor quam
                    hendrerit sapien volutpat accumsan. Proin dictum sed ligula
                    cursus egestas. Etiam at fringilla quam. Vivamus at nibh
                    malesuada, efficitur ante vel, lacinia enim. Ut vel justo
                    odio. Pellentesque nec aliquam odio. Nulla luctus congue
                    enim vitae dignissim. Aliquam vitae interdum dolor. Nunc non
                    facilisis dui, eu porta nisi. Etiam ac augue eu risus
                    placerat facilisis. In hac habitasse platea dictumst.
                    Phasellus sed maximus quam. Vestibulum non interdum risus,
                    nec venenatis nibh. Aenean iaculis nulla in lobortis
                    condimentum.
                  </p>
                </div>
                <p className="text-xl text-[#FFC300] font-bold cursor-pointer hover:underline">
                  See more <EastIcon />
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RecentActivites;
