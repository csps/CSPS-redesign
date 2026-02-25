import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiCheck } from "react-icons/fi";

/**
 * Option interface for ImageSelectDropdown.
 * Supports image, label, sublabel, and optional badge.
 */
export interface ImageSelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  imageUrl?: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger";
}

interface ImageSelectDropdownProps {
  options: ImageSelectOption[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

/**
 * A visually rich dropdown component featuring product images with info.
 * Follows dark theme with purple accents and smooth Framer Motion animations.
 */
const ImageSelectDropdown: React.FC<ImageSelectDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  emptyMessage = "No options available",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const getBadgeClasses = (variant?: string) => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "warning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "danger":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-3 w-full bg-zinc-800/80 border rounded-xl px-3 py-2.5 text-left transition-all ${
          isOpen
            ? "border-purple-500/50 ring-2 ring-purple-500/20"
            : "border-zinc-700 hover:border-zinc-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {/* Selected Option Preview */}
        {selectedOption ? (
          <>
            {selectedOption.imageUrl && (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                <img
                  src={selectedOption.imageUrl}
                  alt={selectedOption.label}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {selectedOption.label}
              </p>
              {selectedOption.sublabel && (
                <p className="text-xs text-zinc-500 truncate">
                  {selectedOption.sublabel}
                </p>
              )}
            </div>
            {selectedOption.badge && (
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getBadgeClasses(selectedOption.badgeVariant)}`}
              >
                {selectedOption.badge}
              </span>
            )}
          </>
        ) : (
          <span className="flex-1 text-sm text-zinc-500">{placeholder}</span>
        )}
        <FiChevronDown
          className={`text-zinc-500 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-zinc-500">
                  {emptyMessage}
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-left transition-all ${
                        isSelected
                          ? "bg-purple-500/15 border border-purple-500/30"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {/* Option Image */}
                      {option.imageUrl && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-800">
                          <img
                            src={option.imageUrl}
                            alt={option.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Option Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isSelected ? "text-purple-300" : "text-white"
                          }`}
                        >
                          {option.label}
                        </p>
                        {option.sublabel && (
                          <p className="text-xs text-zinc-500 truncate">
                            {option.sublabel}
                          </p>
                        )}
                      </div>

                      {/* Badge */}
                      {option.badge && (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${getBadgeClasses(option.badgeVariant)}`}
                        >
                          {option.badge}
                        </span>
                      )}

                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageSelectDropdown;
