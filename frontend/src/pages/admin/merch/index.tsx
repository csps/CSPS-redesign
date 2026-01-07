import React, { useState } from "react";
import Layout from "../../../components/Layout"; 
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import StudentTable from "./components/StudentTable";
import AddStudentModal from "./components/AddStudentModal"; 

const StudentsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleExportCSV = () => {
    console.log("Exporting CSV...");
    // Export logic here
  };

  return (
    <Layout>
      <AuthenticatedNav />
      
      <div className="w-full max-w-[95rem] mx-auto pt-8 pb-20 px-6 space-y-8 relative">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Computer Science Students</h1>
          
          <div className="flex gap-4">
            <button 
              onClick={handleExportCSV}
              className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 transition shadow-lg backdrop-blur-sm cursor-pointer"
            >
              Export CSV
            </button>
            
            <button 
              onClick={() => setIsAddModalOpen(true)} // <-- Open Modal
              className="px-5 py-2.5 rounded-xl bg-[#7d56c0] hover:bg-[#6b49a6] text-white text-sm font-semibold transition shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              Add Student
            </button>
          </div>
        </div>

        {/* Table Component */}
        <div className="w-full">
          <StudentTable />
        </div>

      </div>

      {isAddModalOpen && (
        <AddStudentModal onClose={() => setIsAddModalOpen(false)} />
      )}

    </Layout>
  );
};

export default StudentsPage;