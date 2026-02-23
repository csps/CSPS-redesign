import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineClose,
  MdOutlineImage,
  MdEvent,
  MdArrowForward,
} from "react-icons/md";
import toast from "react-hot-toast";
import { createEvent, updateEvent } from "../../../../api/event";
import type { EventRequest } from "../../../../interfaces/event/EventRequest";
import type { EventResponse } from "../../../../interfaces/event/EventResponse";
import { EventType } from "../../../../enums/EventType";
import { EventStatus } from "../../../../enums/EventStatus";
import { DatePicker } from "../../../../components/DatePicker";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: EventResponse) => void;
  initialEvent?: EventResponse | null; // For editing
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  initialEvent,
}) => {
  // Event Form State
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
  const [isEventSubmitting, setIsEventSubmitting] = useState(false);
  const [eventErrors, setEventErrors] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset or populate form when opening/closing
  useEffect(() => {
    if (isOpen) {
      if (initialEvent) {
        setFormData({
          eventName: initialEvent.eventName,
          eventDescription: initialEvent.eventDescription,
          eventLocation: initialEvent.eventLocation,
          eventDate: initialEvent.eventDate,
          startTime: initialEvent.startTime,
          endTime: initialEvent.endTime,
          eventType: initialEvent.eventType,
          eventStatus: initialEvent.eventStatus,
        });
        // We can't easily set the file object from URL, but user can upload new one
      } else {
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
      }
      setEventErrors({});
    }
  }, [isOpen, initialEvent]);

  // --- Helpers ---

  const isPastDate = (dateStr: string, timeStr: string) => {
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    return dateTime < new Date();
  };

  // --- Handlers ---

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (eventErrors[name]) {
      setEventErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
      if (eventErrors.image) {
        setEventErrors((prev) => ({ ...prev, image: false }));
      }
    }
  };

  // Create or Update Event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {};

    if (!formData.eventName) errors.eventName = true;
    if (!formData.eventDate) errors.eventDate = true;
    if (!formData.startTime) errors.startTime = true;
    if (!formData.endTime) errors.endTime = true;
    if (!formData.eventLocation) errors.eventLocation = true;

    // Image is required for new events, optional for updates (keep existing)
    if (!initialEvent && !image) errors.image = true;

    setEventErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isPastDate(formData.eventDate, formData.startTime)) {
      toast.error("Cannot schedule event in the past");
      return;
    }

    setIsEventSubmitting(true);
    try {
      let resultEvent: EventResponse;

      if (initialEvent) {
        // Update existing
        resultEvent = await updateEvent(
          initialEvent.eventId,
          formData,
          image || undefined,
        );
        toast.success("Event updated successfully!");
      } else {
        // Create new
        resultEvent = await createEvent(formData, image!);
        toast.success("Event created successfully!");
      }

      onEventCreated(resultEvent);
      // Don't close here, let parent handle flow (e.g. open sessions modal)
    } catch (error) {
      console.error("Failed to save event:", error);
      const msg =
        (error as any).response?.data?.message ||
        "Failed to save event. Please try again.";
      toast.error(msg);
    } finally {
      setIsEventSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isEventSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-xl bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-gray-800/30 rounded-t-[32px]">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MdEvent className="text-purple-400" />
                  {initialEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  {initialEvent
                    ? "Update event details below"
                    : "Step 1: Define event details"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-900/50 rounded-b-[32px]">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Event Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase  mb-2 px-1 text-white/50">
                      Event Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      placeholder="Enter a catchy title..."
                      disabled={isEventSubmitting}
                      className={`w-full h-[46px] bg-[#1e1e2e] border rounded-xl px-4 text-sm text-white focus:outline-none transition-colors placeholder-white/20 disabled:opacity-50 ${
                        eventErrors.eventName
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 px-1 text-white/50">
                      Description
                    </label>
                    <textarea
                      name="eventDescription"
                      value={formData.eventDescription}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us more about the event..."
                      disabled={isEventSubmitting}
                      className="w-full bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20 resize-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={eventErrors.eventDate ? "opacity-100" : ""}>
                    <DatePicker
                      label="Date *"
                      value={formData.eventDate}
                      onChange={(date) => {
                        setFormData({ ...formData, eventDate: date });
                        if (eventErrors.eventDate) {
                          setEventErrors((prev) => ({
                            ...prev,
                            eventDate: false,
                          }));
                        }
                      }}
                      placeholder="Select event date"
                      minDate={new Date().toISOString().split("T")[0]}
                    />
                    {eventErrors.eventDate && (
                      <p className="text-red-500 text-xs mt-1 px-1">
                        Date is required
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase  mb-2 px-1 text-white/50">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleInputChange}
                      placeholder="Venue / Platform"
                      disabled={isEventSubmitting}
                      className={`w-full h-[46px] bg-[#1e1e2e] border rounded-xl px-4 text-sm text-white focus:outline-none transition-colors placeholder-white/20 disabled:opacity-50 ${
                        eventErrors.eventLocation
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase  mb-2 px-1 text-white/50">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      disabled={isEventSubmitting}
                      className={`w-full h-[46px] bg-[#1e1e2e] border rounded-xl px-4 text-sm text-white focus:outline-none transition-colors [color-scheme:dark] disabled:opacity-50 ${
                        eventErrors.startTime
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase  mb-2 px-1 text-white/50">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      disabled={isEventSubmitting}
                      className={`w-full h-[46px] bg-[#1e1e2e] border rounded-xl px-4 text-sm text-white focus:outline-none transition-colors [color-scheme:dark] disabled:opacity-50 ${
                        eventErrors.endTime
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase  mb-2 px-1 text-white/50">
                      Event Category
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      disabled={isEventSubmitting}
                      className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors [&>option]:bg-[#111827] disabled:opacity-50"
                    >
                      {Object.values(EventType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase  mb-2 px-1 text-white/50">
                      Initial Status
                    </label>
                    <div className="w-full h-[46px] bg-white/5 border border-white/5 rounded-xl px-4 flex items-center text-sm text-white/40 cursor-not-allowed">
                      {initialEvent ? initialEvent.eventStatus : "UPCOMING"}
                    </div>
                  </div>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center cursor-pointer group ${
                    eventErrors.image
                      ? "border-red-500/50 bg-red-500/5 hover:border-red-400/50"
                      : image
                        ? "border-purple-500/50 bg-purple-500/5"
                        : "border-white/10 hover:border-purple-500/50 hover:bg-white/5"
                  } ${isEventSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isEventSubmitting}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${image ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/30 group-hover:text-white/50"}`}
                    >
                      <MdOutlineImage size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm font-bold uppercase ">
                        {image
                          ? image.name
                          : initialEvent
                            ? "Update Cover Image (Optional)"
                            : "Upload Cover Image"}
                      </p>
                      <p
                        className={`text-[10px] mt-1 uppercase font-medium ${
                          eventErrors.image ? "text-red-400" : "text-white/30"
                        }`}
                      >
                        {eventErrors.image
                          ? "Image is required"
                          : "Max 5MB • JPG, PNG, WEBP"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isEventSubmitting}
                  className="w-full h-[56px] bg-[#FDE006] hover:brightness-110 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm active:scale-95"
                >
                  {isEventSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      Next: Add Sessions <MdArrowForward />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;
