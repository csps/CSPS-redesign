import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineClose,
  MdOutlineImage,
  MdCheckCircle,
  MdEvent,
} from "react-icons/md";
import toast from "react-hot-toast";
import { createEvent } from "../../../api/event";
import type { EventRequest } from "../../../interfaces/event/EventRequest";
import { EventType } from "../../../enums/EventType";
import { EventStatus } from "../../../enums/EventStatus";
import { DatePicker } from "../../../components/DatePicker";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.eventName ||
      !formData.eventDate ||
      !formData.startTime ||
      !formData.endTime ||
      !image
    ) {
      toast.error("Please fill in all required fields including image");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEvent(formData, image);
      setShowSuccess(true);
      setTimeout(() => {
        onEventAdded?.();
        onClose();
        // Reset form
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
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            onClick={onClose}
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
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MdEvent className="text-purple-400" />
                Launch New Event
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-900/50 rounded-b-[32px]">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Main Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                      Event Title
                    </label>
                    <input
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      placeholder="Enter a catchy title..."
                      className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                      Description
                    </label>
                    <textarea
                      name="eventDescription"
                      value={formData.eventDescription}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us more about the event..."
                      className="w-full bg-[#1e1e2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20 resize-none"
                    />
                  </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePicker
                    label="Date"
                    value={formData.eventDate}
                    onChange={(date) =>
                      setFormData({ ...formData, eventDate: date })
                    }
                    placeholder="Select event date"
                  />
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                      Location
                    </label>
                    <input
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleInputChange}
                      placeholder="Venue / Platform"
                      className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20"
                    />
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Type & Static Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                      Event Category
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors [&>option]:bg-[#111827]"
                    >
                      {Object.values(EventType).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50 opacity-50">
                      Initial Status
                    </label>
                    <div className="w-full h-[46px] bg-white/5 border border-white/5 rounded-xl px-4 flex items-center text-sm text-white/40 cursor-not-allowed">
                      UPCOMING
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center cursor-pointer group ${
                    image
                      ? "border-purple-500/50 bg-purple-500/5"
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
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${image ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/30 group-hover:text-white/50"}`}
                    >
                      <MdOutlineImage size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-white text-sm font-bold uppercase tracking-tight">
                        {image ? image.name : "Upload Cover Image"}
                      </p>
                      <p className="text-white/30 text-[10px] mt-1 uppercase tracking-widest font-medium">
                        Max 5MB • JPG, PNG, WEBP
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[56px] bg-[#FDE006] hover:brightness-110 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm active:scale-95"
                >
                  {isSubmitting ? "Processing..." : "Launch Event"}
                </button>
              </form>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-[60] flex items-center justify-center p-8 bg-[#111827]/90 backdrop-blur-md rounded-[32px]"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                    <MdCheckCircle size={40} className="text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Success!
                  </h2>
                  <p className="text-white/50 text-sm">
                    Event created and published.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;
