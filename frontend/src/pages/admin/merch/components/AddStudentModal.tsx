import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt, FaChevronDown } from "react-icons/fa";

interface AddStudentModalProps {
  onClose: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    studentId: "",
    email: "",
    password: "",
    contactNumber: "",
    yearLevel: "3rd Year", // Default
    isMember: false,
  });

  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Add logic to send data to backend here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#130b35] rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-12 animate-in fade-in zoom-in duration-200">
        {/* Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition"
        >
          <FaTimes size={24} />
        </button>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Upload & Membership (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Upload Box */}
            <div className="aspect-square bg-[#1b143f] rounded-3xl border-2 border-white/5 flex flex-col items-center justify-center text-white cursor-pointer hover:border-purple-500/50 hover:bg-[#231b4d] transition group">
              <FaCloudUploadAlt className="text-8xl mb-4 text-white group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-white/50 group-hover:text-white/80">
                Upload Photo
              </span>
            </div>

            {/* Membership Box */}
            <div className="bg-[#211a45] rounded-xl p-5 border border-white/5">
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wide">
                CSP-S Membership
              </h3>
              <div className="flex justify-between items-center bg-[#161130] p-1 rounded-lg">
                {/* Member Option */}
                <label
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer transition-all ${formData.isMember ? "bg-purple-600 text-white shadow-lg" : "text-white/40 hover:text-white"}`}
                >
                  <input
                    type="radio"
                    name="membership"
                    className="hidden"
                    checked={formData.isMember}
                    onChange={() =>
                      setFormData({ ...formData, isMember: true })
                    }
                  />
                  <span className="text-xs font-bold">MEMBER</span>
                </label>

                {/* Not Member Option */}
                <label
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md cursor-pointer transition-all ${!formData.isMember ? "bg-[#353059] text-white" : "text-white/40 hover:text-white"}`}
                >
                  <input
                    type="radio"
                    name="membership"
                    className="hidden"
                    checked={!formData.isMember}
                    onChange={() =>
                      setFormData({ ...formData, isMember: false })
                    }
                  />
                  <span className="text-xs font-bold">NOT MEMBER</span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form Fields (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Row 1: First & Middle Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">
                  Middle Name
                </label>
                <input
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            {/* Row 2: Last Name & Student ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">Student ID</label>
                <input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            {/* Row 3: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">Password</label>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            {/* Row 4: Year Level & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
              {/* Custom Dropdown for Year Level */}
              <div className="space-y-2 relative">
                <label className="text-white/80 text-sm pl-1">Year Level</label>
                <div
                  className="w-full bg-[#352f5b] text-white px-4 py-3 rounded-xl flex justify-between items-center cursor-pointer border border-transparent hover:border-purple-500 transition"
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                >
                  <span className="font-semibold text-purple-300">
                    Year Level:{" "}
                    <span className="text-white">{formData.yearLevel}</span>
                  </span>
                  <FaChevronDown className="text-sm" />
                </div>

                {/* Dropdown Menu */}
                {showYearDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-[#2c264e] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map(
                      (year) => (
                        <div
                          key={year}
                          onClick={() => {
                            setFormData({ ...formData, yearLevel: year });
                            setShowYearDropdown(false);
                          }}
                          className="px-4 py-3 text-white hover:bg-purple-600/50 cursor-pointer transition"
                        >
                          {year}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-sm pl-1">
                  Contact Number
                </label>
                <input
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  type="text"
                  className="w-full bg-[#211a45] text-white px-4 py-3 rounded-xl border border-transparent focus:border-purple-500 outline-none transition"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-[#3d3765] hover:bg-[#4d467f] text-white rounded-xl font-bold shadow-lg transition"
              >
                Save
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#a33b3b] hover:bg-[#c24545] text-white rounded-xl font-bold shadow-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
