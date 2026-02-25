import React, { useState, useEffect, useCallback } from "react";
import ActiveMembersTable from "./ActiveMembersTable";
import NonMembersTable from "./NonMembersTable";
import GrantMembershipModal from "./GrantMembershipModal";
import {
  getActiveMembersPaginated,
  getInactiveMembersPaginated,
  searchStudentMemberships,
  exportActiveMemberships,
  exportInactiveMemberships,
} from "../../../../api/studentMembership";
import type { StudentMembershipResponse } from "../../../../interfaces/student/StudentMembership";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import type { PaginatedResponse } from "../../../../interfaces/paginated";

/**
 * Tab toggle component that switches between Active Members and Non-Members tables.
 * Each tab independently manages its own pagination state.
 * Includes search filters (academic year range, student name/ID) and CSV export.
 *
 * @param canEditFinance - whether the current user has finance permissions (RBAC)
 * @param refreshTrigger - external trigger to refresh the membership list after bulk operations
 */

interface MemberTabsProps {
  canEditFinance: boolean;
  refreshTrigger?: number;
}

type TabId = "active" | "inactive";

const MemberTabs: React.FC<MemberTabsProps> = ({
  canEditFinance,
  refreshTrigger = 0,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("active");

  // Active members search/filter state
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [academicYearRange, setAcademicYearRange] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Non-members search/filter state
  const [inactiveSearchName, setInactiveSearchName] = useState("");
  const [inactiveSearchId, setInactiveSearchId] = useState("");
  const [inactiveYearLevel, setInactiveYearLevel] = useState<number | "">("");
  const [inactiveIsSearchMode, setInactiveIsSearchMode] = useState(false);

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Grant Membership Modal state
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);

  // active members state
  const [activePage, setActivePage] = useState(0);
  const [activeData, setActiveData] =
    useState<PaginatedResponse<StudentMembershipResponse> | null>(null);
  const [activeLoading, setActiveLoading] = useState(false);

  // inactive members state
  const [inactivePage, setInactivePage] = useState(0);
  const [inactiveData, setInactiveData] =
    useState<PaginatedResponse<StudentResponse> | null>(null);
  const [inactiveLoading, setInactiveLoading] = useState(false);

  /**
   * Parses a selected academic year range string (e.g. "2025-2026")
   * into its yearStart and yearEnd components.
   *
   * @param rangeStr - the hyphen-separated year range
   * @returns object with yearStart and yearEnd, or undefined values if empty
   */
  const parseYearRange = (
    rangeStr: string,
  ): { yearStart?: number; yearEnd?: number } => {
    if (!rangeStr) return {};
    const [start, end] = rangeStr.split("-").map(Number);
    return { yearStart: start, yearEnd: end };
  };

  // Check if any filter is active for active members
  const hasActiveFilters =
    searchName.trim() !== "" ||
    searchId.trim() !== "" ||
    academicYearRange !== "";

  // Check if any filter is active for inactive members
  const hasInactiveFilters =
    inactiveSearchName.trim() !== "" ||
    inactiveSearchId.trim() !== "" ||
    inactiveYearLevel !== "";

  /**
   * Fetches active members, optionally applying search filters.
   * Uses the search endpoint when filters are set, otherwise the default paginated endpoint.
   */
  const fetchActive = useCallback(async () => {
    try {
      setActiveLoading(true);
      if (hasActiveFilters) {
        const { yearStart, yearEnd } = parseYearRange(academicYearRange);
        const data = await searchStudentMemberships({
          studentName: searchName.trim() || undefined,
          studentId: searchId.trim() || undefined,
          activeStatus: "ACTIVE",
          yearStart,
          yearEnd,
          page: activePage,
          size: 7,
        });
        setActiveData(data);
        setIsSearchMode(true);
      } else {
        const data = await getActiveMembersPaginated(activePage, 7);
        setActiveData(data);
        setIsSearchMode(false);
      }
    } catch (err) {
      console.error("failed to load active members:", err);
    } finally {
      setActiveLoading(false);
    }
  }, [activePage, searchName, searchId, academicYearRange, hasActiveFilters]);

  /**
   * Fetches inactive (non-member) students, optionally applying search filters.
   */
  const fetchInactive = useCallback(async () => {
    try {
      setInactiveLoading(true);
      if (hasInactiveFilters) {
        const data = await searchStudentMemberships({
          studentName: inactiveSearchName.trim() || undefined,
          studentId: inactiveSearchId.trim() || undefined,
          activeStatus: "INACTIVE",
          page: inactivePage,
          size: 7,
        });
        setInactiveData(data as unknown as PaginatedResponse<StudentResponse>);
        setInactiveIsSearchMode(true);
      } else {
        const data = await getInactiveMembersPaginated(inactivePage, 7);
        setInactiveData(data);
        setInactiveIsSearchMode(false);
      }
    } catch (err) {
      console.error("failed to load inactive members:", err);
    } finally {
      setInactiveLoading(false);
    }
  }, [
    inactivePage,
    inactiveSearchName,
    inactiveSearchId,
    inactiveYearLevel,
    hasInactiveFilters,
  ]);

  // Reset pages when filters change
  useEffect(() => {
    setActivePage(0);
  }, [searchName, searchId, academicYearRange]);

  useEffect(() => {
    setInactivePage(0);
  }, [inactiveSearchName, inactiveSearchId, inactiveYearLevel]);

  // fetch on tab switch or page change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "active") {
        fetchActive();
      } else {
        fetchInactive();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, fetchActive, fetchInactive, refreshTrigger]);

  /**
   * Clears all active membership search filters.
   */
  const clearFilters = () => {
    setSearchName("");
    setSearchId("");
    setAcademicYearRange("");
  };

  /**
   * Clears all inactive (non-member) search filters.
   */
  const clearInactiveFilters = () => {
    setInactiveSearchName("");
    setInactiveSearchId("");
    setInactiveYearLevel("");
  };

  /**
   * Callback after a membership is successfully granted — refreshes the inactive list.
   */
  const handleGrantMembershipSuccess = () => {
    fetchInactive();
  };

  /**
   * Exports the currently active tab's data as a CSV file download.
   * Active members export includes yearStart/yearEnd; inactive exports student info.
   */
  const handleExport = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);

      if (activeTab === "active") {
        const data = await exportActiveMemberships();
        const headers = [
          "Membership ID",
          "Student ID",
          "Date Joined",
          "Active",
          "Year Start",
          "Year End",
        ];
        const rows = data.map((m) => [
          m.membershipId,
          m.studentId,
          m.dateJoined,
          m.active ? "Yes" : "No",
          m.yearStart,
          m.yearEnd,
        ]);
        downloadCSV(
          headers,
          rows,
          `active_members_${new Date().toISOString().split("T")[0]}.csv`,
        );
      } else {
        const data = await exportInactiveMemberships();
        const headers = [
          "Student ID",
          "First Name",
          "Last Name",
          "Year Level",
          "Email",
        ];
        const rows = data.map((s) => [
          s.studentId,
          s.user.firstName,
          s.user.lastName,
          s.yearLevel,
          s.user.email,
        ]);
        downloadCSV(
          headers,
          rows,
          `non_members_${new Date().toISOString().split("T")[0]}.csv`,
        );
      }
    } catch (err) {
      console.error("failed to export:", err);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Generates and downloads a CSV file from headers and rows.
   *
   * @param headers  - array of column header strings
   * @param rows     - 2D array of cell values
   * @param filename - the download filename
   */
  const downloadCSV = (
    headers: string[],
    rows: (string | number | boolean)[][],
    filename: string,
  ) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "active", label: "Active Members" },
    { id: "inactive", label: "Non-Members" },
  ];

  // Generate academic year range options for the dropdown (e.g. "2025-2026", "2024-2025", ...)
  const currentYear = new Date().getFullYear();
  const academicYearOptions = Array.from({ length: 5 }, (_, i) => {
    const start = currentYear - i;
    return `${start}-${start + 1}`;
  });

  return (
    <div>
      {/* Grant Membership Modal */}
      <GrantMembershipModal
        isOpen={grantModalOpen}
        student={selectedStudent}
        onClose={() => {
          setGrantModalOpen(false);
          setSelectedStudent(null);
        }}
        onSuccess={handleGrantMembershipSuccess}
      />

      {/* Header with tabs and export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Tab Toggle */}
        <div className="flex gap-1 p-1 bg-[#1E1E3F] rounded-xl border border-white/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-purple-600/10 text-purple-400 border border-purple-500/20"
                  : "text-zinc-400 hover:text-zinc-200 border border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export CSV
            </>
          )}
        </button>
      </div>

      {/* Search Filters for Active Members */}
      {activeTab === "active" && (
        <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search name..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search ID..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Academic Year Range */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-1.5">
                Academic Year
              </label>
              <select
                value={academicYearRange}
                onChange={(e) => setAcademicYearRange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="">All Years</option>
                {academicYearOptions.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full px-3 py-2 border border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Search indicator */}
          {isSearchMode && activeData && (
            <p className="text-xs text-zinc-500 mt-3">
              Found {activeData.totalElements} result
              {activeData.totalElements !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* Search Filters for Non-Members */}
      {activeTab === "inactive" && (
        <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                value={inactiveSearchName}
                onChange={(e) => setInactiveSearchName(e.target.value)}
                placeholder="Search name..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                value={inactiveSearchId}
                onChange={(e) => setInactiveSearchId(e.target.value)}
                placeholder="Search ID..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Year Level */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-1.5">
                Year Level
              </label>
              <select
                value={inactiveYearLevel}
                onChange={(e) =>
                  setInactiveYearLevel(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="">All Years</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={clearInactiveFilters}
                disabled={!hasInactiveFilters}
                className="w-full px-3 py-2 border border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Search indicator */}
          {inactiveIsSearchMode && inactiveData && (
            <p className="text-xs text-zinc-500 mt-3">
              Found {inactiveData.totalElements} result
              {inactiveData.totalElements !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* tab content */}
      {activeTab === "active" ? (
        <ActiveMembersTable
          data={activeData}
          loading={activeLoading}
          currentPage={activePage}
          onPageChange={setActivePage}
        />
      ) : (
        <NonMembersTable
          data={inactiveData}
          loading={inactiveLoading}
          currentPage={inactivePage}
          onPageChange={setInactivePage}
          canEditFinance={canEditFinance}
          onGrantMembership={(student) => {
            setSelectedStudent(student);
            setGrantModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default MemberTabs;
