import React from "react";
import {
  ProfileCard,
  DetailRow,
  SectionLabel,
  inputStyles,
} from "./ProfileUIElements";
import { FiAlertTriangle } from "react-icons/fi";
import { MdCheck } from "react-icons/md";

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
  onUpdateEmail?: () => void;
}

/**
 * Credentials management tab.
 * Displays personal and academic information with edit support.
 */
const CredentialsTab: React.FC<CredentialsTabProps> = ({
  formData,
  studentId,
  isEditing,
  isVerified = true,
  onFieldChange,
  onSave,
  onDiscard,
  onVerifyEmail,
  onUpdateEmail,
}) => {
  const formattedBirthDate = formData.birthDate
    ? new Date(formData.birthDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-10">
        {/* personal info */}
        <div>
          <SectionLabel title="Personal" />

          <ProfileCard>
            <DetailRow
              label="First name"
              value={formData.firstName || "—"}
              isEditing={isEditing}
              editInput={
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={onFieldChange}
                  className={inputStyles.base}
                />
              }
            />
            <DetailRow
              label="Last name"
              value={formData.lastName || "—"}
              isEditing={isEditing}
              editInput={
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={onFieldChange}
                  className={inputStyles.base}
                />
              }
            />
            <DetailRow
              label="Middle name"
              value={formData.middleName || "—"}
              isEditing={isEditing}
              editInput={
                <input
                  name="middleName"
                  value={formData.middleName}
                  onChange={onFieldChange}
                  className={inputStyles.base}
                />
              }
            />
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

        {/* contact info */}
        <div>
          <SectionLabel title="Security & Contact" />

          {/* email not verified warning */}
          {!isVerified && (
            <div className="mb-4 flex items-center gap-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl px-5 py-4 shadow-lg shadow-yellow-500/5">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                <FiAlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-yellow-400 uppercase tracking-wide">
                  Action Required
                </p>
                <p className="text-xs text-yellow-400/60 mt-0.5 font-medium">
                  Your email is not verified. Please verify to ensure full
                  account access.
                </p>
              </div>
              {onVerifyEmail && (
                <button
                  onClick={onVerifyEmail}
                  className="shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-yellow-400 text-black hover:brightness-110 transition-all shadow-lg shadow-yellow-400/20"
                >
                  Verify
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
              isLast={!(isVerified && onUpdateEmail)}
            />
            {isVerified && onUpdateEmail && (
              <div className="px-8 py-4 border-t border-white/5 bg-white/[0.01]">
                <button
                  onClick={onUpdateEmail}
                  className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Update email address
                </button>
              </div>
            )}
          </ProfileCard>
        </div>
      </div>

      {/* right column */}
      <div className="space-y-10">
        {/* academic info */}
        <div>
          <SectionLabel title="Academic" />
          <ProfileCard>
            <DetailRow label="Student ID" value={studentId} />
            <DetailRow
              label="Year level"
              value={`Level ${formData.yearLevel}`}
              isLast
            />
          </ProfileCard>
        </div>

        {/* account overview */}
        <div>
          <SectionLabel title="Account Overview" />
          <ProfileCard>
            <DetailRow
              label="Full name"
              value={`${formData.firstName} ${formData.lastName}`}
            />
          </ProfileCard>
        </div>

        {/* save bar */}
        {isEditing && (
          <div className="flex items-center justify-between gap-6 p-6 bg-white/[0.03] border border-white/10 rounded-[24px] shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-tight">
                Unsaved changes
              </p>
              <p className="text-xs text-white/40 mt-0.5 font-medium">
                Please review your changes before saving.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onDiscard}
                className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white px-4 py-2 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-2 bg-[#FDE006] hover:brightness-110 text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/10 active:scale-95"
              >
                <MdCheck className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CredentialsTab;
