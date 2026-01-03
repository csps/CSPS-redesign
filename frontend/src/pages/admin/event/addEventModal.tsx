import React, { useState } from "react";
import { 
  FaTimes, FaCalendarAlt, FaAlignLeft, FaCloudUploadAlt, 
  FaMapMarkerAlt, FaUsers, FaClock, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

interface AddEventModalProps {
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(19); // Default to 19
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2;
    return day > 0 && day <= 30 ? day : "";
  });

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-[#110e31] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">New Event</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition cursor-pointer">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Floating Avatar (Optional visual btw) */}
        <div className="absolute top-8 right-20 hidden md:block">
          <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-[#110e31] overflow-hidden">
             <img src="https://i.pravatar.cc/150?img=3" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1: Date/Time */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3">
              <FaCalendarAlt className="text-white/40 mr-3" />
              <input 
                type="text" 
                placeholder="Event Title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-white/40" 
              />
            </div>

            {/* Calendar Widget */}
            <div className="bg-[#3a3b5c] rounded-xl p-4 text-white">
              <div className="flex justify-between items-center mb-4 text-sm font-medium">
                <button><FaChevronLeft className="text-white/60" /></button>
                <span>September 2021</span>
                <button><FaChevronRight className="text-white/60" /></button>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] text-white/50 mb-2 uppercase tracking-wide">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              <div className="grid grid-cols-7 text-center gap-y-3 text-sm">
                {days.map((day, idx) => (
                  <div key={idx} className="relative group cursor-pointer">
                    <button 
                      onClick={() => day !== "" && setSelectedDay(day as number)}
                      disabled={day === ""}
                      className={`
                        w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-all duration-200
                        ${day === "" ? "cursor-default opacity-0" : ""}
                        ${selectedDay === day ? "bg-[#d97757] text-white font-bold shadow-lg scale-110" : "text-white/90 hover:bg-white/10"}
                      `}
                    >
                      {day}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3">
                <FaClock className="text-white/40 mr-2" />
                <input 
                  type="text" 
                  placeholder="Start" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent text-sm w-full text-white outline-none placeholder-white/40" 
                />
              </div>
              <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3">
                <FaClock className="text-white/40 mr-2" />
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
          <div className="h-full">
            <div className="bg-[#242050] rounded-xl p-4 h-full flex flex-col">
              <div className="flex items-center mb-2 border-b border-white/10 pb-2">
                <FaAlignLeft className="text-white/40 mr-3" />
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
            <div className="flex-1 bg-[#242050] rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/50 cursor-pointer hover:bg-[#2f2b60] transition min-h-[150px]">
              <FaCloudUploadAlt size={40} className="mb-2" />
              <span className="text-lg font-medium">Upload photos</span>
            </div>

            <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-white/40 mr-3" />
              <input 
                type="text" 
                placeholder="Event Location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none text-white w-full placeholder-white/40" 
              />
            </div>

            <div className="flex items-center bg-[#242050] rounded-xl px-4 py-3 relative">
              <FaUsers className="text-white/40 mr-3" />
              <select className="bg-transparent border-none outline-none text-white w-full appearance-none cursor-pointer">
                <option className="bg-[#242050]">Limited to: All</option>
                <option className="bg-[#242050]">Limited to: Members</option>
              </select>
            </div>

            <div className="mt-auto flex justify-end">
              <button className="bg-[#4d4c7d] hover:bg-[#5e5c94] text-white font-bold py-3 px-8 rounded-xl shadow-lg transition">
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