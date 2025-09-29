import React, { useEffect, useState } from "react";
import ExpandableButton from "./ExpandableButton";



export interface Card {
  name: string;
  role: string;
  image?: string;
}

interface CardStackProps {
  cards: Card[];
  cardWidth?: number;
  cardHeight?: number;
  cardOffsetX?: number;
  cardOffsetY?: number;
  scaleFactor?: number;
}

export const CardStack: React.FC<CardStackProps> = ({
  cards: initialCards,
  cardWidth = 500,
  cardHeight = 520,
  cardOffsetX = 100,
  cardOffsetY = 0,
  scaleFactor = 0.05,
}) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartY, setDragStartY] = useState(0);
  const [jump, setJump] = useState(false);

  // Window resize
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive calculations
  const getResponsiveCardWidth = () => {
    if (windowSize.width <= 480) return Math.min(cardWidth * 0.45, windowSize.width - 60);
    if (windowSize.width < 768) return Math.min(cardWidth * 0.65, windowSize.width - 80);
    if (windowSize.width < 1024) return Math.min(cardWidth * 0.8, windowSize.width - 100);
    return cardWidth;
  };

  const getResponsiveCardHeight = () => {
    if (windowSize.width <= 480) return cardHeight * 0.5;
    if (windowSize.width < 768) return cardHeight * 0.7;
    if (windowSize.width < 1024) return cardHeight * 0.8;
    return cardHeight;
  };

  const getResponsiveOffsetX = () => {
    if (windowSize.width <= 480) return cardOffsetX * 0.2;
    if (windowSize.width < 768) return cardOffsetX * 0.4;
    if (windowSize.width < 1024) return cardOffsetX * 0.7;
    return cardOffsetX;
  };

  const responsiveCardWidth = getResponsiveCardWidth();
  const responsiveCardHeight = getResponsiveCardHeight();
  const responsiveOffsetX = getResponsiveOffsetX();

  // Move array helper
  const moveArray = <T,>(array: T[], from: number, to: number): T[] => {
    const result = [...array];
    const [item] = result.splice(from, 1);
    result.splice(to, 0, item);
    return result;
  };

  // Auto-rotate with jump
  const moveTopCardWithJump = () => {
    setJump(true); // start jump
    setTimeout(() => {
      setCards((prev) => moveArray([...prev], 0, prev.length - 1)); // move top card
      setJump(false); // reset jump
    }, 200); // jump duration
  };

  // Drag handlers
  const handleDragStart = (e: React.PointerEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleDragMove = (e: React.PointerEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const rect = e.currentTarget.getBoundingClientRect();

    const deltaY = clientY - dragStartY;
    const deltaX = clientX - (rect.left + rect.width / 2);

    const constrainedY = Math.max(
      windowSize.width <= 480 ? -80 : windowSize.width < 768 ? -100 : -200,
      Math.min(windowSize.width <= 480 ? 20 : windowSize.width < 768 ? 25 : 50, deltaY)
    );

    setDragOffset({ x: deltaX * 0.1, y: constrainedY });
  };

  const handleDragEnd = () => {
    const swipeUpThreshold = windowSize.width < 768 ? -25 : -50;
    if (dragOffset.y < swipeUpThreshold) {
      moveTopCardWithJump();
    }
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setDragStartY(0);
  };

  // Auto-rotate interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) moveTopCardWithJump();
    }, 4000);
    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: windowSize.width <= 480 ? "350px" : windowSize.width < 768 ? "450px" : "600px",
        maxWidth: "100%",
    
      }}
      className="px-2"
    >
      <ul
        style={{
          position: "relative",
          width: responsiveCardWidth + responsiveOffsetX * Math.min(cards.length - 1, 3),
          height: responsiveCardHeight + 30,
          maxWidth: "100%",
        }}
      >
        {cards.map((card, index) => {
          const isTop = index === 0;
          const baseScale = 1 - index * (windowSize.width <= 480 ? scaleFactor * 0.5 : scaleFactor);
          const dragScale = isTop && isDragging ? baseScale + 0.02 : baseScale;

          return (
            <li
              key={`${card.name}-${index}`}
              style={{
                position: "absolute",
                width: responsiveCardWidth,
                height: responsiveCardHeight,
                backgroundColor: "purple",
                cursor: isTop ? (isDragging ? "grabbing" : "grab") : "auto",
                overflow: "hidden",
                filter: isTop ? "none" : "blur(6px)",
                opacity: 1,
                borderRadius: windowSize.width <= 480 ? "12px" : windowSize.width < 768 ? "15px" : "25px",
                listStyle: "none",
                boxShadow: isTop ? "0 10px 30px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.2)",
                right: index * (responsiveOffsetX * 0.7),
                top:
                  index * (cardOffsetY + 10) +
                  (isTop ? (jump ? -40 : dragOffset.y) : 0),
                transform: `scale(${dragScale})`,
                zIndex: cards.length - index,
                transformOrigin: "left center",
                transition: isDragging ? "none" : "all 0.25s ease",
              }}
              onPointerDown={isTop ? handleDragStart : undefined}
              onPointerMove={isTop ? handleDragMove : undefined}
              onPointerUp={isTop ? handleDragEnd : undefined}
              onTouchStart={isTop ? handleDragStart : undefined}
              onTouchMove={isTop ? handleDragMove : undefined}
              onTouchEnd={isTop ? handleDragEnd : undefined}
            >
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: windowSize.width <= 480 ? "12px" : windowSize.width < 768 ? "15px" : "25px",
                    pointerEvents: "none",
                  }}
                  draggable={false}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{
                    borderRadius: windowSize.width <= 480 ? "12px" : windowSize.width < 768 ? "15px" : "25px",
                    background: "linear-gradient(135deg, #8B5A9F 0%, #6A4C93 50%, #4C2C85 100%)",
                  }}
                >
                  {card.name}
                </div>
              )}

              <div
                className={`absolute bottom-0 w-full bg-gradient-to-r from-[#141414]/60 via-[#1c1c1c]/60 to-[#222222]/60 backdrop-blur-[15px] shadow-lg text-white ${
                  windowSize.width <= 480 ? "h-20 p-2" : windowSize.width < 768 ? "h-24 p-3" : "h-30 p-7"
                }`}
              >
                <p
                  className={`font-semibold leading-tight ${
                    windowSize.width <= 480 ? "text-sm" : windowSize.width < 768 ? "text-lg" : "text-4xl"
                  }`}
                >
                  {card.name}
                </p>
                <p className={`text-[#FFFFFF] ${windowSize.width <= 480 ? "text-xs" : "text-sm"}`}>
                  {card.role}
                </p>
                <ExpandableButton
                  className={`${
                    windowSize.width <= 480 ? "bottom-12 right-2 text-xs px-1 py-0.5" : windowSize.width < 768 ? "bottom-14 right-3" : "bottom-23 right-5"
                  }`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
