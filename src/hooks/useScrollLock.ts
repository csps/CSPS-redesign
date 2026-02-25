import { useEffect } from "react";

export const useScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};