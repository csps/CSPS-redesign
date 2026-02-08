import { useState, useMemo } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SearchFilter from "../../merch/components/SearchFilter"; // <--- Import the new component
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";

const StudentTable = ({
  students,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onStudentClick,
}: {
  students: StudentResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onStudentClick?: (student: StudentResponse) => void;
}) => {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");

  // --- TRANSFORM DATA ---
  const allStudents = students.map((student) => ({
    id: student.studentId,
    last: student.user.lastName,
    first: student.user.firstName,
    middle: student.user.middleName || "",
    email: student.user.email,
    year: `${student.yearLevel}${student.yearLevel === 1 ? "st" : student.yearLevel === 2 ? "nd" : student.yearLevel === 3 ? "rd" : "th"}`,
  }));

  // --- FILTERING LOGIC ---
  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesSearch =
        student.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.includes(searchQuery);

      const matchesYear =
        selectedYear === "All" || student.year === selectedYear;

      return matchesSearch && matchesYear;
    });
  }, [searchQuery, selectedYear, allStudents]);

  // Since data is server-paginated, currentStudents is filteredStudents
  const currentStudents = filteredStudents;

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
        onSearch={(query) => setSearchQuery(query)}
        onFilterYear={(year) => setSelectedYear(year)}
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
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr
                  key={index}
                  onClick={() => onStudentClick?.(students[index])}
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
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
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStudentClick?.(students[index]);
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
                  colSpan={8}
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
};

export default StudentTable;
