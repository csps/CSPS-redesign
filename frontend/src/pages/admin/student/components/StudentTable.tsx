import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SearchFilter from "../../merch/components/SearchFilter"; // <--- Import the new component
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import { AdminPosition } from "../../../../enums/AdminPosition";

/**
 * Formats a position enum value into a human-readable string.
 * Special cases for acronyms like VP, PIO, and PRO are handled specifically.
 *
 * @param {AdminPosition} position - The raw position enum value from the API.
 * @returns {string} A human-readable representation of the position.
 */
const formatPosition = (position: AdminPosition): string => {
  if (position === "VP_INTERNAL") return "VP Internal";
  if (position === "VP_EXTERNAL") return "VP External";
  if (position === "PIO") return "PIO";
  if (position === "PRO") return "PRO";

  return position
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const StudentTable = ({
  students,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onStudentClick,
  onSearch,
  onFilterYear,
}: {
  students: StudentResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onStudentClick?: (student: StudentResponse) => void;
  onSearch: (query: string) => void;
  onFilterYear: (year: string) => void;
}) => {
  // --- TRANSFORM DATA ---
  const currentStudents = students.map((student) => ({
    id: student.studentId,
    last: student.user.lastName,
    first: student.user.firstName,
    middle: student.user.middleName || "",
    email: student.user.email,
    year: `${student.yearLevel}${student.yearLevel === 1 ? "st" : student.yearLevel === 2 ? "nd" : student.yearLevel === 3 ? "rd" : "th"}`,
    adminPosition: student.adminPosition,
    original: student,
  }));

  // Pagination Helper (Dots Logic)
  const getPaginationGroup = () => {
    let pageNumbers = [];
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    if (totalPages > 1) pageNumbers.push(totalPages);
    return [...new Set(pageNumbers)];
  };

  return (
    <div className="bg-[#110e31] border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* --- NEW SEARCH FILTER COMPONENT --- */}
      <SearchFilter
        onSearch={onSearch}
        onFilterYear={onFilterYear}
      />

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-white">
          <thead className="bg-[#1a1635] text-white/70 uppercase text-xs font-semibold tracking-wider sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="accent-purple-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4">Student ID</th>
              <th className="px-6 py-4">Last Name</th>
              <th className="px-6 py-4">First Name</th>
              <th className="px-6 py-4">Middle Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr
                  key={index}
                  onClick={() => onStudentClick?.(student.original)}
                  className={`hover:bg-white/5 transition-colors group cursor-pointer ${student.adminPosition ? "bg-purple-500/5" : ""}`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="accent-purple-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-purple-300">
                    {student.id}
                  </td>
                  <td className="px-6 py-4">{student.last}</td>
                  <td className="px-6 py-4">{student.first}</td>
                  <td className="px-6 py-4 text-white/50">{student.middle}</td>
                  <td className="px-6 py-4 text-white/70">{student.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium 
                      ${
                        student.year === "1st"
                          ? "bg-green-500/20 text-green-300"
                          : student.year === "2nd"
                            ? "bg-blue-500/20 text-blue-300"
                            : student.year === "3rd"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {student.year} Year
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.adminPosition ? (
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {formatPosition(student.adminPosition)}
                      </span>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStudentClick?.(student.original);
                        }}
                        className="bg-[#FDE006] hover:bg-[#8f6ad0] text-black h-8 px-4 rounded-lg flex items-center justify-center transition text-xs font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-10 text-white/30 italic"
                >
                  No students found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 mt-auto flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 border-t border-white/5 gap-4 bg-[#110e31]">
        <span>
          Showing{" "}
          <strong className="text-yellow-400">
            {(currentPage - 1) * 7 + 1}-
            {(currentPage - 1) * 7 + currentStudents.length}
          </strong>{" "}
          from <strong className="text-yellow-400">{totalElements}</strong> data
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaAngleLeft />
          </button>

          {getPaginationGroup().map((item, index) => (
            <button
              key={index}
              onClick={() => typeof item === "number" && onPageChange(item)}
              disabled={item === "..."}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition
                ${
                  item === "..."
                    ? "cursor-default text-white/40 border-none"
                    : currentPage === item
                      ? "bg-[#eab308] text-black font-bold shadow-lg"
                      : "border border-white/10 hover:bg-white/10 text-white"
                }`}
            >
              {item}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentTable;
