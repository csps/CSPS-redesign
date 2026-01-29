import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderStatus } from "../../../../../enums/OrderStatus";

const options = [
  {
    label: "TO BE CLAIMED",
    value: OrderStatus.TO_BE_CLAIMED,
    color: "text-yellow-400",
  },
  {
    label: OrderStatus.PENDING,
    value: OrderStatus.PENDING,
    color: "text-red-500",
  },
  {
    label: OrderStatus.CLAIMED,
    value: OrderStatus.CLAIMED,
    color: "text-green-500",
  },
];

type StatusOption = (typeof options)[0];

interface StatusDropdownProps {
  selected: StatusOption;
  onSelect: (option: StatusOption) => void;
}

export default function StatusDropdown({
  selected,
  onSelect,
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-m">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-[#2a2456] px-4 py-4 text-white"
      >
        <span className="opacity-80">Status:</span>
        <span
          className={`font-semibold ${selected.color}  inline-block w-[130px]`}
        >
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
            className="absolute left-0 mt-2 w-full rounded-xl bg-[#2a2456] p-3 shadow-lg"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option);
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
