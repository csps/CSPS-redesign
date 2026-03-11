import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SearchFilter from "../../merch/components/SearchFilter";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import { getAllStudents } from "../../../../api/student";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

const StudentTable = ({
  students,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  onStudentClick,
  onSearch,
  onFilterYear,
  searchQuery = "",
  yearFilter = "All",
  isLoading = false,
}: {
  students: StudentResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onStudentClick?: (student: StudentResponse) => void;
  onSearch: (query: string) => void;
  onFilterYear: (year: string) => void;
  searchQuery?: string;
  yearFilter?: string;
  isLoading?: boolean;
}) => {
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const data = await getAllStudents();

      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const csvHeader =
        "Student ID,Last Name,First Name,Middle Name,Email,Year Level\n";
      const csvRows = data
        .map((student) => {
          const { studentId, yearLevel, user } = student;
          // Escape quotes in strings
          const escape = (str: string) =>
            `"${(str || "").replace(/"/g, '""')}"`;

          return [
            escape(studentId),
            escape(user.lastName),
            escape(user.firstName),
            escape(user.middleName || ""),
            escape(user.email),
            yearLevel,
          ].join(",");
        })
        .join("\n");

      const blob = new Blob([csvHeader + csvRows], {
        type: "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `students_export_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export successful!");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export students");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-[#110e31] border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* --- NEW SEARCH FILTER COMPONENT --- */}
      <SearchFilter
        onSearch={onSearch}
        onFilterYear={onFilterYear}
        onExport={handleExportCSV}
        searchQuery={searchQuery}
        yearFilter={yearFilter}
      />

      {/* Exporting Modal */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1a1635] border border-white/10 rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl"
            >
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">
                  Exporting Data
                </h3>
                <p className="text-white/50 text-sm">
                  Please wait while we generate your CSV...
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5 bg-white/[0.01]">
                  <td className="px-6 py-5"><div className="h-4 w-4 bg-white/10 rounded animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-4 w-20 bg-white/10 rounded animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-6 w-16 bg-white/10 rounded-full animate-pulse"></div></td>
                  <td className="px-6 py-5"><div className="h-8 w-24 bg-white/10 rounded-lg animate-pulse mx-auto"></div></td>
                </tr>
              ))
            ) : currentStudents.length > 0 ? (
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
