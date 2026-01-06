import React, { useState } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaAlignLeft,
  FaCloudUploadAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
} from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/CalendarCustom.css";

interface AddEventModalProps {
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose }) => {
  type Value = Date | null | [Date | null, Date | null];

  const [selectedDay, setSelectedDay] = useState<Value>(new Date());
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  return (
    // Backdrop: Added z-index and padding adjustments
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 md:p-4">
      
      {/* Modal Content Wrapper 
         CHANGES:
         1. max-h-[90vh]: Limits height so it doesn't go off-screen.
         2. overflow-y-auto: Allows scrolling inside the modal when content stacks on mobile.
         3. p-4 md:p-8: Smaller padding on mobile, larger on desktop.
      */}
      <div className="relative w-full max-w-6xl bg-[#110e31] rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl 
                      max-h-[95vh] md:max-h-[90vh] overflow-y-auto 
                      p-4 md:p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6  bg-[#110e31] z-10 py-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">New Event</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition cursor-pointer p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Col 1: Date/Time */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3">
              <FaCalendarAlt className="text-white/40 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-white/40"
              />
            </div>

            {/* Calendar Widget */}
            <div className="bg-[#3a3b5c] rounded-xl p-3 text-white h-[300px] w-full flex flex-col justify-center">
              <Calendar
                onChange={setSelectedDay}
                value={selectedDay}
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
                className="react-calendar compact-calendar"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center bg-[#242050] rounded-xl px-3 py-3">
                <FaClock className="text-white/40 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Start"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent text-sm w-full text-white outline-none placeholder-white/40"
                />
              </div>
              <div className="flex items-center bg-[#242050] rounded-xl px-3 py-3">
                <FaClock className="text-white/40 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="End"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent text-sm w-full text-white outline-none placeholder-white/40"
                />
              </div>
            </div>
          </div>

          {/* Col 2: Description */}
          {/* On mobile, we give this a fixed min-height so it feels substantial */}
          <div className="h-full min-h-[200px] lg:min-h-auto">
            <div className="bg-[#242050] rounded-xl p-4 h-full flex flex-col">
              <div className="flex items-center mb-2 border-b border-white/10 pb-2">
                <FaAlignLeft className="text-white/40 mr-3 shrink-0" />
                <span className="text-white/40">Event Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-white resize-none placeholder-white/20 mt-2 min-h-[150px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                placeholder="Type details here..."
              ></textarea>
            </div>
          </div>

          {/* Col 3: Upload/Save */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-[#242050] rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/50 cursor-pointer hover:bg-[#2f2b60] transition min-h-[120px] lg:min-h-[150px]">
              <FaCloudUploadAlt size={40} className="mb-2" />
              <span className="text-lg font-medium">Upload photos</span>
            </div>

            <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-white/40 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Event Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-white/40"
              />
            </div>

            <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3 relative">
              <FaUsers className="text-white/40 mr-3 shrink-0" />
              <select className="bg-transparent border-none outline-none text-white w-full appearance-none cursor-pointer">
                <option className="bg-[#242050]">Limited to: All</option>
                <option className="bg-[#242050]">Limited to: Members</option>
              </select>
            </div>

            {/* Save Button: Full width on mobile, right-aligned on desktop */}
            <div className="mt-4 lg:mt-auto flex justify-center lg:justify-end">
              <button className="w-full lg:w-auto bg-[#4d4c7d] hover:bg-[#5e5c94] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition">
                Save Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;