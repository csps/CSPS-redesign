import React from "react";
import { 
  Megaphone, 
  UserPlus, 
  CalendarPlus,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "New Announcement",
    description: "Blast to all students",
    icon: Megaphone,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    path: "/admin/bulletin",
  },
  {
    title: "Schedule Event",
    description: "Create organization event",
    icon: CalendarPlus,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    path: "/admin/event",
  },
  {
    title: "Grant Admin",
    description: "Assign new roles",
    icon: UserPlus,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    path: "/admin/students",
  },
  {
    title: "Draft Report",
    description: "Generate summary",
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    path: "/admin/sales",
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={() => navigate(action.path)}
          className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F033C]/40 border border-white/5 hover:border-white/10 hover:bg-[#0F033C]/60 transition-all text-left group"
        >
          <span className={`w-10 h-10 rounded-xl ${action.bg} ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
            <action.icon size={20} />
          </span>
          <section>
            <h4 className="text-sm font-bold text-white mb-0.5">{action.title}</h4>
            <p className="text-xs text-gray-500 leading-tight">{action.description}</p>
          </section>
        </button>
      ))}
    </nav>
  );
};

export default QuickActions;
