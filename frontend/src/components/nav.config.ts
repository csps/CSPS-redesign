import HOME from "../assets/navs/home.svg";
import MERCHANDISE from "../assets/navs/merchandise.svg";
import BULLETIN from "../assets/navs/bulletin.svg";
import EVENTS from "../assets/navs/events.svg";
import STUDENT from "../assets/navs/student.svg";

import UCLOGO from "../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../assets/logos/CSPS PNG (1) 1.png";
import { useAuthStore } from "../store/auth_store";

export const LOGOS: string[] = [UCLOGO, CCSLOGO, CSPSLOGO];

const isAdmin = useAuthStore.getState().user?.role === "ADMIN";

export const NAVBARSAUTHENTICATED: {
  name: string;
  icon?: string;
  to: string;
}[] = [
  { name: "Home", icon: HOME, to: isAdmin ? "/admin/dashboard" : "/dashboard" },
  // { name: "Forum", icon: FORUM, to: "/forum" },
  {
    name: "Merchandise",
    icon: MERCHANDISE,
    to: isAdmin ? "/admin/merch" : "/merch",
  },
  ...(!isAdmin ? [{ name: "Bulletin", icon: BULLETIN, to: "/bulletin" }] : []),
  { name: "Events", icon: EVENTS, to: isAdmin ? "/admin/event" : "/events" },
  ...(isAdmin
    ? [{ name: "Students", icon: STUDENT, to: "/admin/students" }]
    : []),
  // { name: "Resources", icon: RESOURCES, to: "/resources" },
  // { name: "Showcase", icon: SHOWCASE, to: "/showcase" },
  // { name: "Contact us", icon: "", to: "/contact-us" },
];
