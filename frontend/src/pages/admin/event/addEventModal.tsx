import React, { useState, useRef } from "react";
import { MdOutlineClose, MdCheckCircle, MdOutlineImage } from "react-icons/md";
import { motion } from "framer-motion";
import { createEvent } from "../../../api/event";
import type { EventRequest } from "../../../interfaces/event/EventRequest";
import { EventType } from "../../../enums/EventType";
import { EventStatus } from "../../../enums/EventStatus";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded?: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onEventAdded,
}) => {
  const [formData, setFormData] = useState<EventRequest>({
    eventName: "",
    eventDescription: "",
    eventLocation: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    eventType: EventType.OTHER,
    eventStatus: EventStatus.UPCOMING,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.eventName.trim()) errors.eventName = "Event name is required";
    if (!formData.eventDescription.trim())
      errors.eventDescription = "Event description is required";
    if (!formData.eventLocation.trim())
      errors.eventLocation = "Event location is required";
    if (!formData.eventDate) errors.eventDate = "Event date is required";
    if (!formData.startTime) errors.startTime = "Start time is required";
    if (!formData.endTime) errors.endTime = "End time is required";

    if (formData.eventDate) {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.eventDate = "Event date cannot be in the past";
      }
    }

    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);
      if (startTime >= endTime) {
        errors.endTime = "End time must be after start time";
      }
    }

    if (formData.eventDescription.length > 500) {
      errors.eventDescription = "Description must be 500 characters or less";
    }

    if (!image) {
      errors.image = "Event image is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        if (e.target) e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("Image file size must be less than 5MB");
        if (e.target) e.target.value = "";
        return;
      }
    }

    setImage(file);
    if (validationErrors.image) {
      setValidationErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await createEvent(formData, image || undefined);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        onEventAdded?.();
        onClose();
        setFormData({
          eventName: "",
          eventDescription: "",
          eventLocation: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          eventType: EventType.OTHER,
          eventStatus: EventStatus.UPCOMING,
        });
        setImage(null);
        setValidationErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 2000);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        // Container styling inspired by the rounded card in the image
        className="w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[95vh] flex flex-col rounded-[32px] overflow-hidden relative bg-[#170657] shadow-2xl border border-white/10"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Header - Minimalist */}
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 pb-2 shrink-0">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-normal">
            New Event
          </h1>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <MdOutlineClose size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Main Info Section */}
            <div className="space-y-4">
              <div
                className={`relative w-full bg-white/5 rounded-2xl p-3 border transition-colors ${validationErrors.eventName ? "border-red-500/50 bg-red-500/10" : "border-white/5 hover:border-white/20"}`}
              >
                <label className="block text-white/50 text-xs font-medium mb-1 ml-1">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white text-sm font-medium placeholder-white/20 p-1 focus:outline-none"
                  placeholder="e.g. Summer Gala"
                />
                {validationErrors.eventName && (
                  <p className="absolute -bottom-5 left-1 text-red-400 text-[10px]">
                    {validationErrors.eventName}
                  </p>
                )}
              </div>

              <div
                className={`relative w-full bg-white/5 rounded-2xl p-3 border transition-colors ${validationErrors.eventDescription ? "border-red-500/50 bg-red-500/10" : "border-white/5 hover:border-white/20"}`}
              >
                <label className="block text-white/50 text-xs font-medium mb-1 ml-1">
                  Description
                </label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  maxLength={500}
                  rows={2}
                  className="w-full bg-transparent text-white text-sm placeholder-white/20 focus:outline-none resize-none"
                  placeholder="What is this event about?"
                />
                {validationErrors.eventDescription && (
                  <p className="absolute -bottom-5 left-1 text-red-400 text-[10px]">
                    {validationErrors.eventDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Logistics Grid - Mimicking the side-by-side selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`relative w-full bg-white/5 rounded-2xl p-3 border transition-colors ${validationErrors.eventDate ? "border-red-500/50 bg-red-500/10" : "border-white/5 hover:border-white/20"}`}
              >
                <label className="block text-white/50 text-xs font-medium mb-1 ml-1">
                  Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:invert p-1 [&::-webkit-calendar-picker-indicator]:opacity-50"
                />
                {validationErrors.eventDate && (
                  <p className="absolute -bottom-5 left-1 text-red-400 text-[10px]">
                    {validationErrors.eventDate}
                  </p>
                )}
              </div>

              <div
                className={`relative w-full bg-white/5 rounded-2xl p-3 border transition-colors ${validationErrors.eventLocation ? "border-red-500/50 bg-red-500/10" : "border-white/5 hover:border-white/20"}`}
              >
                <label className="block text-white/50 text-xs font-medium mb-1 ml-1">
                  Location
                </label>
                <input
                  type="text"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white text-sm focus:outline-none p-1"
                  placeholder="City, Venue"
                />
                {validationErrors.eventLocation && (
                  <p className="absolute -bottom-5 left-1 text-red-400 text-[10px]">
                    {validationErrors.eventLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Time Range - Mimicking the slider/range UI */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/50 text-xs font-medium">
                  Duration
                </span>
                <span className="text-white/30 text-[10px]">
                  Set time range
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1">
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 rounded-xl px-3 py-2 text-white text-sm text-center border border-white/5 focus:border-purple-500/50 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  {validationErrors.startTime && (
                    <p className="text-red-400 text-[10px] text-center mt-1">
                      {validationErrors.startTime}
                    </p>
                  )}
                </div>
                <span className="text-white/20">-</span>
                <div className="flex-1">
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full bg-black/20 rounded-xl px-3 py-2 text-white text-sm text-center border border-white/5 focus:border-purple-500/50 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                  />
                  {validationErrors.endTime && (
                    <p className="text-red-400 text-[10px] text-center mt-1">
                      {validationErrors.endTime}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative w-full bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-white/20 transition-colors">
                <label className="block text-white/50 text-xs font-medium mb-1 ml-1">
                  Type
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white text-sm focus:outline-none [&>option]:bg-[#170657]"
                >
                  {Object.values(EventType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-white/20 transition-colors">
                <label className="block text-white/50 text-xs font-medium mb-1 ml-1">
                  Status
                </label>
                <select
                  name="eventStatus"
                  value={formData.eventStatus}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white text-sm focus:outline-none [&>option]:bg-[#170657]"
                >
                  {Object.values(EventStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload - Styled as a wide actionable area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center cursor-pointer group ${
                validationErrors.image
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-white/10 hover:border-purple-500/50 hover:bg-white/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <MdOutlineImage size={20} />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {image ? image.name : "Upload Cover Image"}
                  </p>
                  <p className="text-white/40 text-xs">
                    {image
                      ? `${(image.size / 1024 / 1024).toFixed(2)} MB`
                      : "Max 5MB • JPEG, PNG, WEBP"}
                  </p>
                </div>
              </div>
              {validationErrors.image && (
                <p className="text-red-400 text-xs mt-2">
                  {validationErrors.image}
                </p>
              )}
            </div>

            {/* Spacer for button */}
            <div className="h-4" />
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 pt-2 bg-[#170657] border-t border-white/5 z-10">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 sm:py-4 bg-white text-[#170657] rounded-xl font-bold text-sm sm:text-base hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {isSubmitting ? "Processing..." : "Create Event"}
          </button>
        </div>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#170657] border border-white/10 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <MdCheckCircle size={32} />
            </div>
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                Success
              </h2>
              <p className="text-white/60 text-sm">
                Event has been created successfully.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddEventModal;
