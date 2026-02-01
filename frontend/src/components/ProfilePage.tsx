import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth_store";
import { useNavigate } from "react-router-dom";
import type { StudentResponse } from "../interfaces/student/StudentResponse";
import Layout from "./Layout";

// ============================================================================
// Types
// ============================================================================

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

type ActiveTab = "credentials" | "password";

// ============================================================================
// Icons (inline SVG — no external icon dep needed)
// ============================================================================

const IconUser = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx={12} cy={8} r={4} />
  </svg>
);

const IconLock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ============================================================================
// Sub-Components
// ============================================================================

/** Single labelled row inside a detail card */
const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
  isEditing?: boolean;
  editInput?: React.ReactNode;
}> = ({ label, value, isLast, isEditing, editInput }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 px-5 py-3.5 ${
      !isLast ? "border-b border-zinc-800" : ""
    }`}
  >
    <span className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
      {label}
    </span>
    <div className="flex-1 sm:text-right">
      {isEditing && editInput ? (
        editInput
      ) : (
        <span className="text-sm text-zinc-200 font-medium">{value}</span>
      )}
    </div>
  </div>
);

/** Thin section header inside the main content */
const SectionLabel: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
      {title}
    </h3>
    {action}
  </div>
);

/** A bordered card container */
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 ${className}`}
  >
    {children}
  </div>
);

// ============================================================================
// Main Page
// ============================================================================

interface ProfilePageProps {
  onClose?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const student = user as StudentResponse;

  const [activeTab, setActiveTab] = useState<ActiveTab>("credentials");
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

  // ── seed form from store ──────────────────────────────────────────────────
  useEffect(() => {
    if (!student) return;
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
  }, [student]);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "yearLevel" ? Number(value) : value,
    }));
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((p) => ({ ...p, [name]: value }));
  };

  if (!student) return null;

  // ── shared input styles ───────────────────────────────────────────────────
  const inputBase =
    "w-full bg-transparent text-sm text-zinc-200 text-right placeholder-zinc-600 focus:outline-none focus:ring-0 border-none caret-purple-400";
  const selectBase =
    "w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 text-right px-3 py-1.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none";

  // ── initials ──────────────────────────────────────────────────────────────
  const initials =
    (student.user.firstName?.[0] || "") + (student.user.lastName?.[0] || "");

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* Page-level font override */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');
        .profile-root { font-family: 'Geist', 'SF Pro Display', system-ui, sans-serif; }
        /* scrollbar */
        .profile-root ::-webkit-scrollbar { width: 6px; }
        .profile-root ::-webkit-scrollbar-track { background: transparent; }
        .profile-root ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
        /* date input chrome fix */
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.5; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 0.8; }
        /* select arrow */
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; }
      `}</style>

      <div className="profile-root flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-zinc-950 text-zinc-100">
        {/* ═══════════════════════════════════════════════════════════════════
            SIDEBAR
           ═══════════════════════════════════════════════════════════════════ */}
        <aside className="w-full md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950">
          {/* Back */}
          <div className="p-5 pb-0">
            <button
              onClick={() => (onClose ? onClose() : navigate(-1))}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors group"
            >
              <IconChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          {/* Nav */}
          <nav className="p-5 flex flex-row md:flex-col gap-2">
            {(
              [
                {
                  id: "credentials" as ActiveTab,
                  icon: IconUser,
                  label: "Credentials",
                },
                {
                  id: "password" as ActiveTab,
                  icon: IconLock,
                  label: "Password",
                },
              ] as const
            ).map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${active ? "text-purple-400" : ""}`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT
           ═══════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto">
          {/* Avatar banner strip */}
          <div className="relative bg-zinc-950 px-6 md:px-10 pt-10 pb-8 flex flex-col items-start gap-4">
            {/* subtle top gradient accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/20">
                <span className="text-lg font-semibold text-white tracking-tight">
                  {initials}
                </span>
              </div>

              {/* Name + email */}
              <div>
                <h1 className="text-lg font-semibold text-white tracking-tight">
                  {student.user.firstName} {student.user.lastName}
                </h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                  {student.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* ─── Content body ──────────────────────────────────────────────── */}
          <div className="px-6 md:px-10 pb-12">
            {/* ─── CREDENTIALS TAB ─────────────────────────────────────────── */}
            {activeTab === "credentials" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column */}
                <div className="space-y-8">
                  {/* Personal */}
                  <div>
                    <SectionLabel
                      title="Personal"
                      action={
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className={`text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                            isEditing
                              ? "border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10"
                              : "border-zinc-700 text-zinc-400 hover:border-purple-500/50 hover:text-purple-400"
                          }`}
                        >
                          {isEditing ? "Cancel" : "Edit"}
                        </button>
                      }
                    />
                    <Card>
                      <DetailRow
                        label="First Name"
                        value={formData.firstName || "—"}
                        isEditing={isEditing}
                        editInput={
                          <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleField}
                            placeholder="First name"
                            className={inputBase}
                          />
                        }
                      />
                      <DetailRow
                        label="Last Name"
                        value={formData.lastName || "—"}
                        isEditing={isEditing}
                        editInput={
                          <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleField}
                            placeholder="Last name"
                            className={inputBase}
                          />
                        }
                      />
                      <DetailRow
                        label="Middle Name"
                        value={formData.middleName || "—"}
                        isEditing={isEditing}
                        editInput={
                          <input
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleField}
                            placeholder="Middle name"
                            className={inputBase}
                          />
                        }
                      />
                      <DetailRow
                        label="Date of Birth"
                        value={
                          formData.birthDate
                            ? new Date(
                                formData.birthDate + "T00:00:00",
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"
                        }
                        isEditing={isEditing}
                        editInput={
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleField}
                            className={inputBase}
                          />
                        }
                        isLast
                      />
                    </Card>
                  </div>

                  {/* Contact */}
                  <div>
                    <SectionLabel title="Contact" />
                    <Card>
                      <DetailRow
                        label="Email"
                        value={formData.email || "—"}
                        isEditing={isEditing}
                        editInput={
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleField}
                            placeholder="Email"
                            className={inputBase}
                          />
                        }
                        isLast
                      />
                    </Card>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-8">
                  {/* Academic */}
                  <div>
                    <SectionLabel title="Academic" />
                    <Card>
                      <DetailRow label="Student ID" value={student.studentId} />
                      <DetailRow
                        label="Year Level"
                        value={`Year ${formData.yearLevel}`}
                        isEditing={isEditing}
                        editInput={
                          <select
                            name="yearLevel"
                            value={formData.yearLevel}
                            onChange={handleField}
                            className={selectBase}
                          >
                            {[1, 2, 3, 4].map((y) => (
                              <option key={y} value={y}>
                                Year {y}
                              </option>
                            ))}
                          </select>
                        }
                        isLast
                      />
                    </Card>
                  </div>

                  {/* Account */}
                  <div>
                    <SectionLabel title="Account" />
                    <Card>
                      <DetailRow
                        label="Display Name"
                        value={`${formData.firstName} ${formData.lastName}`}
                      />
                      <DetailRow
                        label="Created"
                        value="March 20, 2024"
                        isLast
                      />
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* ─── PASSWORD TAB ────────────────────────────────────────────── */}
            {activeTab === "password" && (
              <div className="max-w-lg">
                <div className="mb-6">
                  <h2 className="text-base font-semibold text-white">
                    Change Password
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Update your password to keep your account secure.
                  </p>
                </div>

                <Card>
                  <div className="p-5 space-y-5">
                    {/* Current */}
                    <div>
                      <label className="text-xs font-medium text-zinc-500 tracking-wide uppercase block mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePassword}
                        placeholder="••••••••"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-zinc-800" />

                    {/* New */}
                    <div>
                      <label className="text-xs font-medium text-zinc-500 tracking-wide uppercase block mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePassword}
                        placeholder="••••••••"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <p className="text-xs text-zinc-600 mt-2">
                        8+ characters — uppercase, lowercase, numbers &amp;
                        special characters required.
                      </p>
                    </div>

                    {/* Confirm */}
                    <div>
                      <label className="text-xs font-medium text-zinc-500 tracking-wide uppercase block mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePassword}
                        placeholder="••••••••"
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                        Update Password
                      </button>
                      <button className="text-zinc-400 hover:text-zinc-200 px-4 py-2 text-sm font-medium transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProfilePage;
