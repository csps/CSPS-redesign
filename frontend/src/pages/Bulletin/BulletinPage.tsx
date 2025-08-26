import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import Layout from "@/components/Layouts/Layout";
import Bulletin1 from "@/assets/Bulletin1.png";
import Bulletin2 from "@/assets/Bulletin2.png";

const BulletinPage = () => {
  return (
    <Layout>
      <div className="relative container mx-auto  z-10 px-6 lg:px-18 pt-32 lg:pt-20 pb-20 flex flex-col gap-15">
        <GlassmorphismCard glassCard={2} className="flex-col md:flex-row">
          <div className="flex-[2] space-y-2 px-5 order-2 md:order-1">
            <p className="text-4xl text-white font-bold">Lorem Ipsum</p>
            <p className="text-lg text-white text-justify w-[90%] line-clamp-8 md:line-clamp-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel
              dolor nunc. Nunc rhoncus venenatis augue vitae tempor. Nulla
              malesuada libero magna, sit amet eleifend nunc tincidunt at.
              Mauris congue molestie nunc, quis finibus nunc commodo ut. Nullam
              aliquet nulla lore m, faucibu smollis libero consequat vel. Morbi
              odio urna, conval lis sed eros quis, faucibus rhoncus nisl. Morbi
              quis dictum orci. Aliquam nec ex non leo aliquet rhoncus.
              Pellentesque elementum, est in tristique pharetra, arcu elit
              ullamcorper dui, et ultricies purus nibh id dolor. Vivamus neque
              nisi, facilisis eget lacinia eu, ultrices eu lorem. Etiam vitae
              diam et nisi accumsan eleifend. Proin elementum metus rutrum,
              volutpat lectus eget, sagittis mauris. Etiam vitae enim at eros
              finibus congue.
            </p>
          </div>
          <div className="flex-[1] order-1">
            <img src={Bulletin1} alt="" className="w-full" />
          </div>
        </GlassmorphismCard>
        <GlassmorphismCard glassCard={2} className="flex-col md:flex-row py-20">
          <div className="flex-[2] space-y-2 px-5 order-2 md:order-1">
            <p className="text-4xl text-white font-bold">Lorem Ipsum</p>
            <p className="text-lg text-white text-justify w-[90%] line-clamp-8 md:line-clamp-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel
              dolor nunc. Nunc rhoncus venenatis augue vitae tempor. Nulla
              malesuada libero magna, sit amet eleifend nunc tincidunt at.
              Mauris congue molestie nunc, quis finibus nunc commodo ut. Nullam
              aliquet nulla lorem, faucibus mollis libero consequat vel. Morbi
              odio urna, convallis sed eros quis, faucibus rhoncus nisl. Morbi
              quis dictum orci. Aliquam nec ex non leo aliquet rhoncus.
              Pellentesque elementum, est in tristique pharetra, arcu elit
              ullamcorper dui, et ultricies purus nibh id dolor. Vivamus neque
              nisi, facilisis eget lacinia eu, ultrices eu lorem. Etiam vitae
              diam et nisi accumsan eleifend. Proin elementum metus rutrum,
              volutpat lectus eget, sagittis mauris. Etiam vitae enim at eros
              finibus congue.{" "}
            </p>
          </div>{" "}
          <div className="flex-[1] order-1">
            <img src={Bulletin2} alt="" className="w-full" />
          </div>{" "}
        </GlassmorphismCard>
      </div>
    </Layout>
  );
};

export default BulletinPage;
