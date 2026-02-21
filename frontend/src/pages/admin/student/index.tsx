import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import StudentTable from "./components/StudentTable";
import AddStudentModal from "../merch/components/AddStudentModal";
import StudentDetailModal from "./components/StudentDetailModal";
import { getStudents } from "../../../api/student";
import type { StudentResponse } from "../../../interfaces/student/StudentResponse";

const StudentsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("All");

  const fetchStudents = async (
    page: number,
    search: string = searchQuery,
    year: string = yearFilter,
  ) => {
    setLoading(true);
    try {
      const response = await getStudents(
        { page: page - 1, size: 7 },
        { search, yearLevel: year },
      );

      setStudents(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchStudents(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchStudents(1, query, yearFilter);
  };

  const handleFilterYear = (year: string) => {
    setYearFilter(year);
    setCurrentPage(1);
    fetchStudents(1, searchQuery, year);
  };

  const handleExportCSV = async () => {
    try {
      // Fetch all students (large size)
      const response = await getStudents(
        { page: 0, size: 10000 },
        { search: searchQuery, yearLevel: yearFilter },
      );
      const data = response.content;

      // Convert to CSV
      const headers = [
        "Student ID",
        "Last Name",
        "First Name",
        "Email",
        "Year Level",
        "Position",
      ];
      const rows = data.map((s) => [
        s.studentId,
        s.user.lastName,
        s.user.firstName,
        s.user.email,
        s.yearLevel,
        s.adminPosition || "N/A",
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "students.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const handleStudentClick = (student: StudentResponse) => {
    setSelectedStudent(student);
  };

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="w-full max-w-[95rem] mx-auto pt-8 pb-20 px-6 space-y-8 relative">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">
            Computer Science Students
          </h1>

          <div className="flex gap-4">
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition backdrop-blur-sm"
            >
              Export CSV
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#FDE006] hover:brightness-110 text-black text-sm font-semibold transition"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Table Component */}
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : (
            <StudentTable
              students={students}
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={handlePageChange}
              onStudentClick={handleStudentClick}
              onSearch={handleSearch}
              onFilterYear={handleFilterYear}
            />
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddStudentModal onClose={() => setIsAddModalOpen(false)} />
      )}

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </Layout>
  );
};

export default StudentsPage;
