import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const options = [
  { label: "To be claimed", value: "toBeClaimed", color: "text-yellow-400" },
  { label: "Pending", value: "pending", color: "text-red-500" },
  { label: "Claimed", value: "claimed", color: "text-green-500" },
];

export default function StatusDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative inline-block text-sm">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-[#2a2456] px-4 py-2 text-white"
      >
        <span className="opacity-80">Status:</span>
        <span className={`font-semibold ${selected.color}  inline-block w-[110px]`}>
          {selected.label}
        </span>
        <span className="ml-1 text-gray-300">▾</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-2 w-full rounded-xl bg-[#2a2456] p-1 shadow-lg"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
                className={`
                  flex w-full rounded-lg px-3 py-2 text-left font-medium
                  hover:bg-white/10
                  ${option.color}
                `}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
