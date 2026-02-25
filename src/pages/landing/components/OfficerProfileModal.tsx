import { motion } from "framer-motion";
import { type Card } from "../../../components/CardStack";
import { X, Github, Linkedin, Mail } from "lucide-react";

interface OfficerProfileModalProps {
  officer: Card;
  onClose: () => void;
}

const OfficerProfileModal = ({
  officer,
  onClose,
}: OfficerProfileModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#1c1c1c] border border-[#ba44df]/20 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-full md:w-2/5 h-64 md:h-auto relative">
          <img
            src={officer.image}
            alt={officer.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="mt-2">
            <h3 className="text-3xl font-bold text-[#ba44df] mb-1">
              {officer.name}
            </h3>
            <p className="text-xl text-white/90 font-medium mb-4">
              {officer.role}
            </p>

            <div className="w-full h-px bg-white/10 my-4" />

            <div className="space-y-4">
              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">
                  About
                </h4>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Dedicated leader committed to fostering innovation and
                  community within CSPS. Responsible for strategic planning and
                  execution of student organization initiatives.
                </p>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">
                  Connect
                </h4>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-2 bg-white/5 rounded-full hover:bg-[#ba44df] hover:text-black transition-all group"
                  >
                    <Mail size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-white/5 rounded-full hover:bg-[#ba44df] hover:text-black transition-all group"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-white/5 rounded-full hover:bg-[#ba44df] hover:text-black transition-all group"
                  >
                    <Github size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OfficerProfileModal;
