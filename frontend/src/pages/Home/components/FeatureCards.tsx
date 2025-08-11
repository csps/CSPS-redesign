import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import type { CardProps } from "@/types/FeaturedCardType";
import { Link } from "react-router-dom";

type FeatureCardsProps = {
  cards: CardProps[];
  className?: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const FeatureCards: React.FC<FeatureCardsProps> = ({ cards, className }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-10 mb-20 items-center ">
      {cards.map((card, index) => (
        <Link to={"/" + card.route}>
          <GlassmorphismCard
            className={
              "cursor-pointer hover:transition-all hover:duration-300 hover:ease-in-out hover:scale-[1.02] hover:shadow-xl " +
              className
            }
            key={index}
            custom={index}
            variants={cardVariants}
          >
            <div className="mb-4">
              <img src={card.icon ?? ""} alt={card.icon} />
            </div>
            <h3 className="text-white text-2xl lg:text-4xl font-normal mb-4 ">
              {card.title}
            </h3>
          </GlassmorphismCard>
        </Link>
      ))}
    </div>
  );
};

export default FeatureCards;
