import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa6";
import { IoEllipsisHorizontal } from "react-icons/io5";

type ButtonProps = {
    className?: string
}
export default function ExpandableButton({ className }: ButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      animate={{
        height: expanded ? 180 : 50, // expand upward
        width: 50,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute
                 flex flex-col items-center justify-end
                 rounded-full border border-white/20 
                 bg-gradient-to-b from-[#1a1a1a]/80 to-[#0d0d0d]/80
                 backdrop-blur-md shadow-md text-white
                 origin-bottom overflow-hidden ` + className}
    >
      {/* icons (only visible when expanded) */}
      {expanded && (
        <div className="flex flex-col items-center gap-4 mt-4">
          <FaFacebookF />
          <FaXTwitter />
          <FaLinkedinIn />
          <FaEnvelope />
        </div>
      )}

      {/* toggle button (always at bottom) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-12 h-12 flex items-center justify-center rounded-full"
      >
        <IoEllipsisHorizontal />
      </button>
    </motion.div>
  );
}
