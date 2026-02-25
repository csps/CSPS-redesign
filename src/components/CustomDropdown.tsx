import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

/**
 * Interface for each dropdown option.
 */
export interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Props for the CustomDropdown component.
 */
interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

/**
 * A highly reusable, themed dropdown component built with Framer Motion.
 * Features a minimalist design with smooth animations and click-outside detection.
 * 
 * @param {CustomDropdownProps} props - The component props.
 * @returns {JSX.Element} The rendered dropdown.
 */
const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20 outline-none focus:border-purple-500/50 ${
          isOpen ? "border-purple-500/50 ring-2 ring-purple-500/10" : ""
        }`}
      >
        <span className={selectedOption ? "text-white" : "text-white/40"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`text-white/40 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 left-0 right-0 mt-2 bg-[#1a1635] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                    option.value === value
                      ? "bg-purple-600/20 text-purple-300"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {option.label}
                  {option.value === value && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
