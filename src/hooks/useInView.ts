// import { useEffect, useRef, useState } from "react";

// interface UseInViewOptions {
//   threshold?: number | number[];
//   rootMargin?: string;
// }

// /**
//  * Custom hook to detect if an element is in the viewport
//  * Returns a ref to attach to the element and a boolean indicating visibility
//  * Useful for lazy loading data when sections scroll into view
//  */
// export const useInView = (options: UseInViewOptions = {}) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const [isInView, setIsInView] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true);
//           // Stop observing once visible to avoid re-triggering
//           observer.unobserve(entry.target);
//         }
//       },
//       {
//         threshold: options.threshold ?? 0.7,
//         rootMargin: options.rootMargin ?? "-10px",
//       },
//     );

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       if (ref.current) {
//         observer.unobserve(ref.current);
//       }
//     };
//   }, [options.threshold, options.rootMargin]);

//   return { ref, isInView };
// };
