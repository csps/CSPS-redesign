import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronDown, FaDownload } from "react-icons/fa";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterYear: (year: string) => void;
  onExport?: () => void;
  searchQuery?: string;
  yearFilter?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterYear,
  onExport,
  searchQuery = "",
  yearFilter = "All",
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync local query when searchQuery prop changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounce search - only trigger after user stops typing for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearch(localQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };
  return (
    <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-white/5">
      <h2 className="text-xl font-bold text-white self-start sm:self-center">
        All Students
      </h2>

      <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64 bg-[#242050] rounded-lg border border-white/10">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-xs" />
          <input
            type="text"
            placeholder="Search for..."
            value={localQuery}
            onChange={handleSearchChange}
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm text-white outline-none placeholder-white/30"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative group">
          <div className="bg-[#242050] rounded-lg border border-white/10 flex items-center px-4 py-2 gap-2 cursor-pointer hover:bg-[#2f2b60] transition h-full">
            <span className="text-sm text-white/80">
              {yearFilter === "All" ? "All Years" : `${yearFilter} Year`}
            </span>
            <FaChevronDown className="text-white/40 text-xs" />
          </div>

          {/* Dropdown Menu (Hover Logic) */}
          <div className="absolute right-0 mt-2 w-32 bg-[#1a1635] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            {["All", "1", "2", "3", "4"].map((year) => (
              <button
                key={year}
                onClick={() => onFilterYear(year)}
                className={`block w-full text-left px-4 py-2 text-sm first:rounded-t-lg last:rounded-b-lg ${
                  yearFilter === year
                    ? "bg-purple-500/20 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {year === "All" ? "All Years" : `${year} Year`}
              </button>
            ))}
          </div>
        </div>

        {/* Export Button */}
        {onExport && (
          <button
            onClick={onExport}
            className="bg-[#242050] hover:bg-[#2f2b60] border border-white/10 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <FaDownload className="text-white/60" size={12} />
            <span>Export</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
