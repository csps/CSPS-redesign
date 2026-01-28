import React, { useState, useRef } from "react";
import { MdOutlineClose, MdCheckCircle } from "react-icons/md";
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

    // Check required fields
    if (!formData.eventName.trim()) {
      errors.eventName = "Event name is required";
    }
    if (!formData.eventDescription.trim()) {
      errors.eventDescription = "Event description is required";
    }
    if (!formData.eventLocation.trim()) {
      errors.eventLocation = "Event location is required";
    }
    if (!formData.eventDate) {
      errors.eventDate = "Event date is required";
    }
    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      errors.endTime = "End time is required";
    }

    // Validate date is not in the past
    if (formData.eventDate) {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.eventDate = "Event date cannot be in the past";
      }
    }

    // Validate time range
    if (formData.startTime && formData.endTime) {
      const startTime = new Date(`2000-01-01T${formData.startTime}`);
      const endTime = new Date(`2000-01-01T${formData.endTime}`);
      if (startTime >= endTime) {
        errors.endTime = "End time must be after start time";
      }
    }

    // Validate description length
    if (formData.eventDescription.length > 500) {
      errors.eventDescription = "Description must be 500 characters or less";
    }

    // Validate image is required
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

    // Clear validation error for this field
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
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        // Clear the input
        if (e.target) {
          e.target.value = "";
        }
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert("Image file size must be less than 5MB");
        // Clear the input
        if (e.target) {
          e.target.value = "";
        }
        return;
      }
    }

    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting event with image:", image);
      console.log("Form data:", formData);

      await createEvent(formData, image || undefined);

      // Show success modal
      setShowSuccessModal(true);

      // Reset form after a delay
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
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
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
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-sm sm:max-w-md md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl overflow-hidden relative bg-[#170657] border border-gray-500"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="relative z-10 w-full p-4 sm:p-6 md:p-8 overflow-y-auto max-h-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 z-20 text-white hover:text-gray-300 transition-colors text-xl sm:text-2xl"
          >
            <MdOutlineClose />
          </button>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-4 sm:mb-6 pr-8 sm:pr-0">
            Add New Event
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Event Name */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-sm sm:text-base ${
                  validationErrors.eventName
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
                placeholder="Enter event name"
              />
              {validationErrors.eventName && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.eventName}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                Description *
              </label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleInputChange}
                required
                maxLength={500}
                rows={2}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none text-sm sm:text-base ${
                  validationErrors.eventDescription
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
                placeholder="Enter event description (max 500 characters)"
              />
              {validationErrors.eventDescription && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.eventDescription}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                Location *
              </label>
              <input
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-sm sm:text-base ${
                  validationErrors.eventLocation
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
                placeholder="Enter event location"
              />
              {validationErrors.eventLocation && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.eventLocation}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm sm:text-base ${
                  validationErrors.eventDate
                    ? "border-red-500"
                    : "border-gray-500"
                }`}
              />
              {validationErrors.eventDate && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.eventDate}
                </p>
              )}
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm sm:text-base ${
                    validationErrors.startTime
                      ? "border-red-500"
                      : "border-gray-500"
                  }`}
                />
                {validationErrors.startTime && (
                  <p className="text-red-400 text-xs mt-1">
                    {validationErrors.startTime}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm sm:text-base ${
                    validationErrors.endTime
                      ? "border-red-500"
                      : "border-gray-500"
                  }`}
                />
                {validationErrors.endTime && (
                  <p className="text-red-400 text-xs mt-1">
                    {validationErrors.endTime}
                  </p>
                )}
              </div>
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  {Object.values(EventType).map((type) => (
                    <option key={type} value={type} className="bg-[#170657]">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Status *
                </label>
                <select
                  name="eventStatus"
                  value={formData.eventStatus}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-white/10 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  {Object.values(EventStatus).map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-[#170657]"
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1 sm:mb-2">
                Event Image *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border rounded-lg text-white file:mr-2 sm:file:mr-4 file:py-1 file:px-2 sm:file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 text-sm sm:text-base ${
                  validationErrors.image ? "border-red-500" : "border-gray-500"
                }`}
              />
              {validationErrors.image && (
                <p className="text-red-400 text-xs mt-1">
                  {validationErrors.image}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full max-w-sm bg-green-600 border border-green-500 rounded-3xl overflow-hidden relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative z-10 w-full p-6 text-center">
              <div className="flex justify-center mb-4">
                <MdCheckCircle className="text-white text-6xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-white/90">Event created successfully</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AddEventModal;
