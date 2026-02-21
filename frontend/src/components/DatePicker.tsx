import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}

function formatDisplay(str: string): string {
  const d = parseDate(str);
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ─── Calendar Popover ─────────────────────────────────────────────────────────

interface CalendarProps {
  value: string;
  minDate?: string;
  maxDate?: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

function Calendar({
  value,
  minDate,
  maxDate,
  onChange,
  onClose,
}: CalendarProps) {
  const today = new Date();
  const initial = parseDate(value) ?? today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [hovered, setHovered] = useState<number | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const selected = parseDate(value);
  const minD = parseDate(minDate ?? "");
  const maxD = parseDate(maxDate ?? "");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (minD && d < minD) return true;
    if (maxD && d > maxD) return true;
    return false;
  }

  function isSelected(day: number) {
    if (!selected) return false;
    return (
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  }

  function isToday(day: number) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function selectDay(day: number) {
    if (isDisabled(day)) return;
    onChange(toLocalDateString(new Date(viewYear, viewMonth, day)));
    onClose();
  }

  // Build grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className="absolute z-50 mt-2 rounded-2xl shadow-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #16163a 0%, #1a1a42 100%)",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        backdropFilter: "blur(20px)",
        minWidth: "300px",
        boxShadow:
          "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-5 pb-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => {
            if (showYearPicker) setViewYear((y) => y - 20);
            else prevMonth();
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <FiChevronLeft size={16} />
        </button>

        <div
          className="text-center cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition-colors"
          onClick={() => setShowYearPicker(!showYearPicker)}
        >
          {!showYearPicker && (
            <span
              className="text-white font-semibold tracking-wide"
              style={{ fontSize: "15px", letterSpacing: "0.02em" }}
            >
              {MONTHS[viewMonth]}
            </span>
          )}
          <span
            className={`${!showYearPicker ? "ml-2" : ""} font-light`}
            style={{ color: "rgba(167,139,250,0.8)", fontSize: "14px" }}
          >
            {showYearPicker ? `Select Year` : viewYear}
          </span>
        </div>

        <button
          onClick={() => {
            if (showYearPicker) setViewYear((y) => y + 20);
            else nextMonth();
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      {showYearPicker ? (
        <div className="grid grid-cols-3 gap-2 p-4 h-[250px] overflow-y-auto custom-scrollbar">
          {Array.from({ length: 100 }, (_, i) => today.getFullYear() - i).map(
            (year) => (
              <button
                key={year}
                onClick={() => {
                  setViewYear(year);
                  setShowYearPicker(false);
                }}
                className={`py-2 rounded-lg text-sm transition-all ${
                  viewYear === year
                    ? "bg-purple-600 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {year}
              </button>
            ),
          )}
        </div>
      ) : (
        <>
          {/* Day labels */}
          <div className="grid grid-cols-7 px-3 pt-4 pb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-bold uppercase tracking-widest pb-2"
                style={{ color: "rgba(139,92,246,0.6)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
            {cells.map((day, idx) => {
              if (day === null) return <div key={idx} />;

              const disabled = isDisabled(day);
              const selected_ = isSelected(day);
              const today_ = isToday(day);
              const hovering = hovered === day && !disabled;

              return (
                <button
                  key={idx}
                  onClick={() => selectDay(day)}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  disabled={disabled}
                  className="relative flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150"
                  style={{
                    height: "36px",
                    fontSize: "13px",
                    color: disabled
                      ? "rgba(255,255,255,0.2)"
                      : selected_
                        ? "#fff"
                        : today_
                          ? "rgba(167,139,250,1)"
                          : hovering
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.7)",
                    background: selected_
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : hovering
                        ? "rgba(139,92,246,0.2)"
                        : "transparent",
                    boxShadow: selected_
                      ? "0 4px 15px rgba(124,58,237,0.4)"
                      : "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  {day}
                  {today_ && !selected_ && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        width: "4px",
                        height: "4px",
                        background: "rgba(167,139,250,0.8)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Quick shortcuts */}
      <div
        className="flex gap-2 px-4 pb-4 pt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {["Today", "Yesterday"].map((label) => (
          <button
            key={label}
            onClick={() => {
              const d = new Date();
              if (label === "Yesterday") d.setDate(d.getDate() - 1);
              const str = toLocalDateString(d);
              if (minD && parseDate(str)! < minD) return;
              if (maxD && parseDate(str)! > maxD) return;
              onChange(str);
              onClose();
            }}
            className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-150"
            style={{
              background: "rgba(139,92,246,0.12)",
              color: "rgba(167,139,250,0.9)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Date Picker Field ────────────────────────────────────────────────────────

export interface DatePickerProps {
  label?: string;
  value: string;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
  className?: string;
  onChange: (date: string) => void;
}

export const DatePicker = ({
  label,
  value,
  minDate,
  maxDate,
  placeholder = "Select date",
  className = "",
  onChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label
          className="block text-[10px] font-bold uppercase tracking-widest mb-2 px-1"
          style={{ color: "rgba(156,163,175,0.8)" }}
        >
          {label}
        </label>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 group ${className}`}
        style={{
          background: open
            ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))"
            : "rgba(255,255,255,0.05)",
          border: open
            ? "1px solid rgba(139,92,246,0.5)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: open
            ? "0 0 0 3px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05)"
            : "none",
        }}
      >
        {/* Calendar icon — custom SVG for a cleaner look */}
        <span
          className="flex-shrink-0 transition-colors"
          style={{
            color: open ? "rgba(167,139,250,1)" : "rgba(255,255,255,0.3)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect
              x="1.5"
              y="3"
              width="15"
              height="13.5"
              rx="2.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M1.5 7.5H16.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M6 1.5V4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M12 1.5V4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <circle cx="6" cy="11" r="1" fill="currentColor" />
            <circle cx="9" cy="11" r="1" fill="currentColor" />
            <circle cx="12" cy="11" r="1" fill="currentColor" />
          </svg>
        </span>

        <span
          className="flex-1 text-sm font-medium"
          style={{
            color: value ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
          }}
        >
          {value ? formatDisplay(value) : placeholder}
        </span>

        {value && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-150 hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <FiX size={12} />
          </span>
        )}
      </button>

      {open && (
        <Calendar
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default DatePicker;
