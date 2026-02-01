import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaKey,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuthStore } from "../store/auth_store";
import { useNavigate } from "react-router-dom";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import Layout from "./Layout";

// ============================================================================
// Sub-component: Detail Row (iOS Grouped List Style)
// ============================================================================

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  isEditing?: boolean;
  editInput?: React.ReactNode;
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  isEditing,
  editInput,
  isLast,
}) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-3 gap-4 py-3.5 px-4 items-center bg-[#1E293B]/40 hover:bg-[#1E293B]/60 transition-colors ${!isLast ? "border-b border-white/5" : ""}`}
  >
    <dt className="text-sm text-gray-400 font-medium">{label}</dt>
    <dd className="text-sm text-white sm:col-span-2 font-medium flex items-center justify-between">
      <div className="w-full">{isEditing && editInput ? editInput : value}</div>
    </dd>
  </div>
);

// ============================================================================
// Sidebar Item Component
// ============================================================================

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
      active
        ? "bg-purple-600/10 text-purple-400"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}
  >
    <Icon
      className={`text-sm ${active ? "text-purple-400" : "text-gray-500"}`}
    />
    {label}
  </button>
);

// ============================================================================
// Main Component
// ============================================================================

interface ProfilePageProps {
  onClose?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  birthDate: string;
  yearLevel: number;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const student = user as StudentResponse;

  // -- States --
  const [activeTab, setActiveTab] = useState<"credentials" | "password">(
    "credentials",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    birthDate: "",
    yearLevel: 1,
  });
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // -- Effects --
  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.user.firstName || "",
        lastName: student.user.lastName || "",
        middleName: student.user.middleName || "",
        email: student.user.email || "",
        birthDate: student.user.birthDate
          ? new Date(student.user.birthDate).toISOString().split("T")[0]
          : "",
        yearLevel: student.yearLevel || 1,
      });
    }
  }, [student]);

  // -- Handlers --
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearLevel" ? Number(value) : value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBackClick = () => (onClose ? onClose() : navigate(-1));

  // Minimal iOS-like input style
  const InputStyle =
    "w-full bg-transparent border-b border-purple-500/50 focus:border-purple-500 px-0 py-1 text-white focus:outline-none transition-colors placeholder-gray-600";
  const SelectStyle =
    "w-full bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none";

  if (!student) return null;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-[#0F172A]">
        {/* =======================
            LEFT SIDEBAR 
           ======================= */}
        <div className="w-full md:w-64 flex-shrink-0 border-r border-white/5 p-6 bg-[#0F172A]">
          {/* Back Button (Mobile/Desktop) */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <FaArrowLeft className="text-xs" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="space-y-8">
            {/* Section: Settings */}

            {/* Section: My Account */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                My Account
              </h3>
              <div className="space-y-1">
                <SidebarItem
                  icon={FaUser}
                  label="Credentials"
                  active={activeTab === "credentials"}
                  onClick={() => setActiveTab("credentials")}
                />
                <SidebarItem
                  icon={FaKey}
                  label="Change Password"
                  active={activeTab === "password"}
                  onClick={() => setActiveTab("password")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* =======================
            MAIN CONTENT AREA 
           ======================= */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header (Centered) */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-purple-500 to-indigo-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden">
                    {student.user.firstName ? (
                      <span className="text-3xl font-bold text-white">
                        {student.user.firstName[0]}
                        {student.user.lastName[0]}
                      </span>
                    ) : (
                      <FaUser className="text-3xl text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-4 border-[#0F172A]">
                  <FaUser className="text-[10px]" />
                </div>
              </div>
              <h1 className="mt-4 text-2xl font-bold text-white">
                {student.user.firstName} {student.user.lastName}
              </h1>
              <p className="text-gray-400 text-sm">{student.user.email}</p>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === "credentials" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* -- Personal Details Column -- */}
                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-base font-semibold text-white">
                      Personal Details
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${isEditing ? "bg-red-500/10 text-red-400" : "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"}`}
                    >
                      {isEditing ? "Cancel Editing" : "Edit Details"}
                    </button>
                  </div>

                  <div className="border border-white/5 rounded-md overflow-hidden bg-[#1E293B]/20">
                    <DetailRow
                      label="First Name"
                      value={formData.firstName}
                      isEditing={isEditing}
                      editInput={
                        <input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={InputStyle}
                        />
                      }
                    />
                    <DetailRow
                      label="Last Name"
                      value={formData.lastName}
                      isEditing={isEditing}
                      editInput={
                        <input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={InputStyle}
                        />
                      }
                    />
                    <DetailRow
                      label="Middle Name"
                      value={formData.middleName || "N/A"}
                      isEditing={isEditing}
                      editInput={
                        <input
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          className={InputStyle}
                        />
                      }
                    />
                    <DetailRow
                      label="Date of Birth"
                      value={
                        formData.birthDate
                          ? new Date(formData.birthDate).toLocaleDateString()
                          : "Not set"
                      }
                      isEditing={isEditing}
                      editInput={
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                          className={InputStyle}
                        />
                      }
                      isLast
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between mb-4 px-1">
                    <h2 className="text-base font-semibold text-white">
                      Contact Information
                    </h2>
                  </div>
                  <div className="border border-white/5 rounded-md overflow-hidden bg-[#1E293B]/20">
                    <DetailRow
                      label="Email"
                      value={formData.email}
                      isEditing={isEditing}
                      editInput={
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={InputStyle}
                        />
                      }
                      isLast
                    />
                  </div>
                </div>

                {/* -- Account Details Column -- */}
                <div>
                  <h2 className="text-base font-semibold text-white mb-4 px-1">
                    Academic Information
                  </h2>
                  <div className="border border-white/5 rounded-md overflow-hidden bg-[#1E293B]/20 mb-8">
                    <DetailRow label="Student ID" value={student.studentId} />
                    <DetailRow
                      label="Year Level"
                      value={`Year ${formData.yearLevel}`}
                      isEditing={isEditing}
                      editInput={
                        <select
                          name="yearLevel"
                          value={formData.yearLevel}
                          onChange={handleInputChange}
                          className={SelectStyle}
                        >
                          <option value={1}>Year 1</option>
                          <option value={2}>Year 2</option>
                          <option value={3}>Year 3</option>
                          <option value={4}>Year 4</option>
                        </select>
                      }
                      isLast
                    />
                  </div>

                  <h2 className="text-base font-semibold text-white mb-4 px-1">
                    Account Information
                  </h2>
                  <div className="border border-white/5 rounded-md overflow-hidden bg-[#1E293B]/20">
                    <DetailRow
                      label="Display Name"
                      value={`${formData.firstName} ${formData.lastName}`}
                    />
                    <DetailRow
                      label="Account Created"
                      value="March 20, 2024"
                      isLast
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password Change Section */}
            {activeTab === "password" && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-400">
                    Update your password to keep your account secure
                  </p>
                </div>

                <div className="border border-white/5 rounded-md overflow-hidden bg-[#1E293B]/20 p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Must be at least 8 characters with uppercase, lowercase,
                        numbers, and special characters
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors">
                        Update Password
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
