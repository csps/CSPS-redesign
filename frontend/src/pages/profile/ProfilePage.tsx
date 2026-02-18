import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth_store";
import { usePasswordChange } from "../../hooks/usePasswordChange";
import { profile as refreshProfile } from "../../api/auth";
import type { StudentResponse } from "../../interfaces/student/StudentResponse";
import Layout from "../../components/Layout";
import ProfileSidebar, { type ActiveTab } from "./components/ProfileSidebar";
import CredentialsTab from "./components/CredentialsTab";
import PasswordTab from "./components/PasswordTab";
import {
  PasswordSuccessModal,
  PasswordConfirmModal,
} from "./components/PasswordModals";
import EmailVerificationModal from "../../components/EmailVerificationModal";
import EmailUpdateModal from "./components/EmailUpdateModal";

/**
 * ProfilePage component.
 *
 * Main container for user profile management.
 * Adheres to modern UI principles: clean layout, consistent spacing, and modular components.
 */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const student = user as StudentResponse | null;

  const {
    form: passwordForm,
    isLoading: isPasswordLoading,
    error: passwordError,
    isSuccess: isPasswordSuccess,
    showConfirm: showConfirmModal,
    handleChange: handlePasswordChange,
    initiateChange: initiatePasswordChange,
    confirmChange: confirmPasswordChange,
    setIsSuccess: setPasswordSuccess,
    setShowConfirm: setShowConfirmModal,
    resetState: resetPasswordState,
  } = usePasswordChange();

  const [activeTab, setActiveTab] = useState<ActiveTab>("credentials");
  const [isEditing, setIsEditing] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showEmailUpdateModal, setShowEmailUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    birthDate: "",
    yearLevel: 1,
  });

  // Sync form data with profile
  useEffect(() => {
    if (student?.user) {
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

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearLevel" ? Number(value) : value,
    }));
  };

  const handleSaveProfile = () => {
    // Implement save logic here (API call)
    console.log("Saving profile:", formData);
    setIsEditing(false);
  };

  const handleDiscardProfile = () => {
    if (student?.user) {
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
    setIsEditing(false);
  };

  const handleVerified = async () => {
    setShowVerificationModal(false);
    // Refresh the user profile to pick up isVerified = true
    try {
      await refreshProfile();
    } catch {
      // Profile will refresh on next load
    }
  };

  const handleEmailUpdateSuccess = async () => {
    // Refresh the user profile to pick up the updated email
    try {
      await refreshProfile();
    } catch {
      // Profile will refresh on next load
    }
  };

  if (!student) return null; // Or a loading spinner

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-[#242050] text-white font-sans">
        {/* Sidebar Navigation */}
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onBack={() => navigate(-1)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto ">
          {/* Tab Content */}
          <section className="px-6 md:px-10 pb-12 pt-6 max-w-7xl mx-auto my-20">
            {activeTab === "credentials" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CredentialsTab
                  onUpdateEmail={() => setShowEmailUpdateModal(true)}
                  formData={formData}
                  studentId={student.studentId}
                  isEditing={isEditing}
                  isVerified={student.user.isVerified ?? true}
                  setIsEditing={setIsEditing}
                  onFieldChange={handleFieldChange}
                  onSave={handleSaveProfile}
                  onDiscard={handleDiscardProfile}
                  onVerifyEmail={() => setShowVerificationModal(true)}
                />
              </div>
            )}

            {activeTab === "password" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PasswordTab
                  passwordForm={passwordForm}
                  onPasswordChange={handlePasswordChange}
                  onSubmit={initiatePasswordChange}
                  onCancel={resetPasswordState}
                  isLoading={isPasswordLoading}
                  error={passwordError}
                />
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Modals */}
      <PasswordConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmPasswordChange}
        isLoading={isPasswordLoading}
      />
      <PasswordSuccessModal
        isOpen={isPasswordSuccess}
        onClose={() => setPasswordSuccess(false)}
      />
      <EmailVerificationModal
        isOpen={showVerificationModal}
        email={student.user.email || ""}
        onClose={() => setShowVerificationModal(false)}
        onVerified={handleVerified}
      />
      <EmailUpdateModal
        isOpen={showEmailUpdateModal}
        onClose={() => setShowEmailUpdateModal(false)}
        currentEmail={student.user.email || ""}
        onSuccess={handleEmailUpdateSuccess}
      />
    </Layout>
  );
};

export default ProfilePage;
