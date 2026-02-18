import React from "react";
import {
  ProfileCard,
  DetailRow,
  SectionLabel,
  inputStyles,
} from "./ProfileUIElements";
import { IconPencil, IconX, IconCheck } from "./Icons";
import { FiAlertTriangle } from "react-icons/fi";

interface CredentialsTabProps {
  formData: {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    birthDate: string;
    yearLevel: number;
  };
  studentId: string;
  isEditing: boolean;
  isVerified?: boolean;
  setIsEditing: (val: boolean) => void;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSave: () => void;
  onDiscard: () => void;
  onVerifyEmail?: () => void;
}

/**
 * Credentials management tab.
 *
 * Displays personal and academic information. Name and year level are read-only.
 * Adheres to the new deep purple theme with white/40 text and white/10 borders.
 *
 * @param {CredentialsTabProps} props - Component properties
 * @returns {JSX.Element} The rendered credentials tab
 */
const CredentialsTab: React.FC<CredentialsTabProps> = ({
  formData,
  studentId,
  isEditing,
  isVerified = true,
  setIsEditing,
  onFieldChange,
  onSave,
  onDiscard,
  onVerifyEmail,
}) => {
  const formattedBirthDate = formData.birthDate
    ? new Date(formData.birthDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left column: Personal & Contact */}
      <div className="space-y-8">
        {/* Personal Info */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SectionLabel
            title="Personal identity"
            action={
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border transition-all duration-300 ${
                  isEditing
                    ? "border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10"
                    : "border-white/10 text-white/40 hover:border-purple-500/50 hover:text-purple-400 hover:bg-white/5"
                }`}
              >
                {isEditing ? (
                  <>
                    <IconX className="w-3 h-3" />
                    Discard
                  </>
                ) : (
                  <>
                    <IconPencil className="w-3 h-3" />
                    Edit contact
                  </>
                )}
              </button>
            }
          />
          <ProfileCard>
            <DetailRow label="First name" value={formData.firstName || "—"} />
            <DetailRow label="Last name" value={formData.lastName || "—"} />
            <DetailRow label="Middle name" value={formData.middleName || "—"} />
            <DetailRow
              label="Birth date"
              value={formattedBirthDate}
              isEditing={isEditing}
              editInput={
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={onFieldChange}
                  className={inputStyles.base}
                />
              }
              isLast
            />
          </ProfileCard>
        </div>

        {/* Contact Info */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <SectionLabel title="Contact access" />

          {/* Email Not Verified Warning */}
          {!isVerified && (
            <div className="mb-4 flex items-center gap-4 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl px-6 py-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="shrink-0 w-10 h-10 bg-yellow-500/15 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-yellow-300 tracking-tight">
                  Email not verified
                </p>
                <p className="text-[11px] text-yellow-400/60 font-medium mt-0.5 leading-relaxed">
                  Verify your email to enable password recovery and full account
                  access.
                </p>
              </div>
              {onVerifyEmail && (
                <button
                  onClick={onVerifyEmail}
                  className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-yellow-500/30 text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/15 transition-all duration-200"
                >
                  Verify now
                </button>
              )}
            </div>
          )}
          <ProfileCard>
            <DetailRow
              label="Email address"
              value={formData.email || "—"}
              isEditing={isEditing}
              editInput={
                <input
                  name="email"
                  value={formData.email}
                  onChange={onFieldChange}
                  placeholder="email@university.edu"
                  className={inputStyles.base}
                />
              }
              isLast
            />
          </ProfileCard>
        </div>
      </div>

      {/* Right column: Academic & Account */}
      <div className="space-y-8">
        {/* Academic Info */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <SectionLabel title="Academic standing" />
          <ProfileCard>
            <DetailRow label="Identification" value={studentId} />
            <DetailRow
              label="Year level"
              value={`Level ${formData.yearLevel}`}
              isLast
            />
          </ProfileCard>
        </div>

        {/* Account Meta */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <SectionLabel title="Account overview" />
          <ProfileCard>
            <DetailRow
              label="Full name"
              value={`${formData.firstName} ${formData.lastName}`}
            />
            <DetailRow label="Is member" value="Active member" isLast />
          </ProfileCard>
        </div>

        {/* Save Action Bar — only shown while editing */}
        {isEditing && (
          <div className="flex items-center justify-between gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl animate-in zoom-in-95 duration-300 backdrop-blur-sm">
            <div>
              <p className="text-sm font-bold text-white tracking-tight">
                Unsaved changes
              </p>
              <p className="text-[10px] text-white/30 mt-1 font-bold uppercase tracking-widest">
                Review your updates
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onDiscard}
                className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white px-4 py-2 transition-all"
              >
                Discard
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20"
              >
                <IconCheck className="w-3 h-3" />
                Save data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialsTab;
