import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

type PageTransitionProps = {
  children: React.ReactNode;
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.98 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.98 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
