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

  // Unified Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [yearLevel, setYearLevel] = useState<number | "">("");

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Grant Membership Modal state
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);

  // Active members state
  const [activePage, setActivePage] = useState(0);
  const [activeData, setActiveData] = useState<PaginatedResponse<StudentMembershipResponse> | null>(null);
  const [activeLoading, setActiveLoading] = useState(false);
  const [activeIsSearchMode, setActiveIsSearchMode] = useState(false);

  // Inactive members state
  const [inactivePage, setInactivePage] = useState(0);
  const [inactiveData, setInactiveData] = useState<PaginatedResponse<StudentResponse> | null>(null);
  const [inactiveLoading, setInactiveLoading] = useState(false);
  const [inactiveIsSearchMode, setInactiveIsSearchMode] = useState(false);

  const queryTrimmed = searchQuery.trim();
  const hasFilters = queryTrimmed !== "" || (activeTab === "inactive" && yearLevel !== "");

  const fetchActive = useCallback(async () => {
    try {
      setActiveLoading(true);
      if (queryTrimmed !== "") {
        const isLetter = /^[a-zA-Z]/.test(queryTrimmed);
        const data = await searchStudentMemberships({
          studentName: isLetter ? queryTrimmed : undefined,
          studentId: !isLetter ? queryTrimmed : undefined,
          activeStatus: "ACTIVE",
          page: activePage,
          size: 7,
        });
        setActiveData(data);
        setActiveIsSearchMode(true);
      } else {
        const data = await getActiveMembersPaginated(activePage, 7);
        setActiveData(data);
        setActiveIsSearchMode(false);
      }
    } catch (err) {
      console.error("failed to load active members:", err);
    } finally {
      setActiveLoading(false);
    }
  }, [activePage, queryTrimmed]);

  const fetchInactive = useCallback(async () => {
    try {
      setInactiveLoading(true);
      if (queryTrimmed !== "" || yearLevel !== "") {
        const isLetter = /^[a-zA-Z]/.test(queryTrimmed);
        const data = await searchStudentMemberships({
          studentName: isLetter && queryTrimmed ? queryTrimmed : undefined,
          studentId: !isLetter && queryTrimmed ? queryTrimmed : undefined,
          activeStatus: "INACTIVE",
          page: inactivePage,
          size: 7,
        });
        
        // Let's filter by yearLevel locally if API doesn't support it directly in search
        // or assuming searchStudentMemberships handles it if it's not present there we might need to handle it.
        // Looking at the old code, yearLevel wasn't even sent to searchStudentMemberships!
        // The old code had inactiveYearLevel state but didn't pass it to API:
        // const data = await searchStudentMemberships({ studentName, studentId, activeStatus: "INACTIVE", page, size });
        
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
  }, [inactivePage, queryTrimmed, yearLevel]);

  // Reset pages when filters change
  useEffect(() => {
    if (activeTab === "active") setActivePage(0);
    else setInactivePage(0);
  }, [searchQuery, yearLevel, activeTab]);

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

  const clearFilters = () => {
    setSearchQuery("");
    setYearLevel("");
  };

  const handleGrantMembershipSuccess = () => {
    fetchInactive();
  };

  const handleExport = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);

      if (activeTab === "active") {
        const data = await exportActiveMemberships();
        const headers = ["Membership ID", "Student ID", "Date Joined", "Active", "Year Start", "Year End"];
        const rows = data.map((m) => [m.membershipId, m.studentId, m.dateJoined, m.active ? "Yes" : "No", m.yearStart, m.yearEnd]);
        downloadCSV(headers, rows, `active_members_${new Date().toISOString().split("T")[0]}.csv`);
      } else {
        const data = await exportInactiveMemberships();
        const headers = ["Student ID", "First Name", "Last Name", "Year Level", "Email"];
        const rows = data.map((s) => [s.studentId, s.user.firstName, s.user.lastName, s.yearLevel, s.user.email]);
        downloadCSV(headers, rows, `non_members_${new Date().toISOString().split("T")[0]}.csv`);
      }
    } catch (err) {
      console.error("failed to export:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = (headers: string[], rows: (string | number | boolean)[][], filename: string) => {
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
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

  const currentData = activeTab === "active" ? activeData : inactiveData;
  const isSearchMode = activeTab === "active" ? activeIsSearchMode : inactiveIsSearchMode;

  return (
    <div className="flex flex-col gap-6">
      <GrantMembershipModal
        isOpen={grantModalOpen}
        student={selectedStudent}
        onClose={() => {
          setGrantModalOpen(false);
          setSelectedStudent(null);
        }}
        onSuccess={handleGrantMembershipSuccess}
      />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1.5 bg-[#1E1E3F] rounded-xl border border-white/5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                clearFilters();
              }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-purple-600/20 text-purple-400"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-5 py-2.5 bg-zinc-800/80 border border-white/5 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isExporting ? "Generating..." : "Export CSV"}
        </button>
      </div>

      {/* Unified Search */}
      <div className="bg-[#1E1E3F] rounded-xl border border-white/5 p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or ID..."
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {activeTab === "inactive" && (
          <div className="w-full sm:w-48">
            <select
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-zinc-900/50 border border-white/5 rounded-xl text-sm text-zinc-200 px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Years</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>
          </div>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search results indicator */}
      {isSearchMode && currentData && (
        <p className="text-xs text-zinc-500 px-1 -mt-2">
          Found {currentData.totalElements} result{currentData.totalElements !== 1 ? "s" : ""}
        </p>
      )}

      {/* Tables */}
      <div className="bg-[#1E1E3F] rounded-xl border border-white/5 overflow-hidden">
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
    </div>
  );
};

export default MemberTabs;
