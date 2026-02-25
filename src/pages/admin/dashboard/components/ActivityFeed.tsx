import React from "react";
import { User, ShoppingCart, Megaphone, Calendar } from "lucide-react";

export interface ActivityItem {
  id: string | number;
  type: "ORDER" | "MEMBERSHIP" | "ANNOUNCEMENT" | "EVENT";
  title: string;
  subtitle: string;
  time: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const iconMap = {
  ORDER: { icon: ShoppingCart, color: "text-amber-400", bg: "bg-amber-500/10" },
  MEMBERSHIP: { icon: User, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ANNOUNCEMENT: { icon: Megaphone, color: "text-blue-400", bg: "bg-blue-500/10" },
  EVENT: { icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <section className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <article key={i} className="flex gap-4 animate-pulse">
            <span className="w-10 h-10 bg-white/5 rounded-full" />
            <section className="flex-1 space-y-2">
              <p className="h-4 bg-white/5 rounded w-1/3" />
              <p className="h-3 bg-white/5 rounded w-1/2" />
            </section>
          </article>
        ))}
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <footer className="text-center py-10">
        <p className="text-gray-500 text-sm">No recent activity found.</p>
      </footer>
    );
  }

  return (
    <section className="relative">
      {/* Timeline Line */}
      <aside className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />

      <ul className="space-y-8 relative list-none">
        {activities.map((activity) => {
          const config = iconMap[activity.type];
          return (
            <li key={`${activity.type}-${activity.id}`} className="flex gap-4 group">
              <span className={`w-10 h-10 rounded-full ${config.bg} ${config.color} flex items-center justify-center shrink-0 z-10 border-4 border-[#0F033C] group-hover:scale-110 transition-transform`}>
                <config.icon size={16} />
              </span>
              <section className="flex-1 min-w-0 pt-1">
                <header className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                    {activity.title}
                  </h4>
                  <span className="text-[10px] font-bold text-gray-500 uppercase whitespace-nowrap">
                    {activity.time}
                  </span>
                </header>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{activity.subtitle}</p>
              </section>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default ActivityFeed;
