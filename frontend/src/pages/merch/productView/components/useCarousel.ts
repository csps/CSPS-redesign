import { useState } from "react";

type SlidePosition = {
  translateY: number;
  scale: number;
  opacity: number;
  z: number;
};

export function useCarousel(itemsLength: number) {
  const [activeIndex, setActiveIndex] = useState<number>(2);

  const getSlidePosition = (index: number): SlidePosition => {
    let diff = index - activeIndex;
    if (diff < -2) diff += itemsLength;
    if (diff > 2) diff -= itemsLength;

    const positions: Record<number, SlidePosition> = {
      "-2": { translateY: -240, scale: 0.7, opacity: 0.4, z: 5 },
      "-1": { translateY: -120, scale: 0.85, opacity: 0.7, z: 10 },
      0: { translateY: 0, scale: 1.1, opacity: 1, z: 20 },
      1: { translateY: 120, scale: 0.85, opacity: 0.7, z: 10 },
      2: { translateY: 240, scale: 0.7, opacity: 0.4, z: 5 },
    };

    return positions[diff];
  };

  return { activeIndex, setActiveIndex, getSlidePosition };
}
