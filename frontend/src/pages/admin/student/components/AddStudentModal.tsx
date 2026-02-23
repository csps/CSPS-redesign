import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { createStudent, type StudentRequest } from "../../../../api/student";
import { toast } from "sonner";

interface AddStudentModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    yearLevel: "1",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentId.trim()) newErrors.studentId = "Student ID is required";
    if (formData.studentId.length !== 8) newErrors.studentId = "Student ID must be 8 characters";
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    // Basic email regex
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: StudentRequest = {
        studentId: formData.studentId,
        yearLevel: parseInt(formData.yearLevel),
        userRequestDTO: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName || undefined,
          email: formData.email,
        },
      };

      await createStudent(payload);
      toast.success("Student added successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1635] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUserPlus className="text-purple-400" />
              Add New Student
            </h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student ID */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. 20210001"
                  maxLength={8}
                  className={`w-full bg-[#110e31] border ${
                    errors.studentId ? "border-red-500" : "border-white/10"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {errors.studentId && (
                  <p className="text-red-400 text-xs mt-1">{errors.studentId}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full bg-[#110e31] border ${
                    errors.firstName ? "border-red-500" : "border-white/10"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full bg-[#110e31] border ${
                    errors.lastName ? "border-red-500" : "border-white/10"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Middle Name (Optional)
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full bg-[#110e31] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Year Level */}
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Year Level
                </label>
                <select
                  name="yearLevel"
                  value={formData.yearLevel}
                  onChange={handleChange}
                  className="w-full bg-[#110e31] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[#110e31] border ${
                    errors.email ? "border-red-500" : "border-white/10"
                  } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#FDE006] text-black font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Student"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddStudentModal;
