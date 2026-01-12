import HOME from "../assets/navs/home.svg";
import FORUM from "../assets/navs/forum.svg";
import MERCHANDISE from "../assets/navs/merchandise.svg";
import BULLETIN from "../assets/navs/bulletin.svg";
import EVENTS from "../assets/navs/events.svg";
import RESOURCES from "../assets/navs/resources.svg";
import SHOWCASE from "../assets/navs/showcase.svg"
import UCLOGO from "../assets/logos/uc_LOGO 1.png";
import CCSLOGO from "../assets/logos/ccs logo 1.png";
import CSPSLOGO from "../assets/logos/CSPS PNG (1) 1.png";

export const LOGOS: string[] = [UCLOGO, CCSLOGO, CSPSLOGO];

export const NAVBARSAUTHENTICATED: {
  name: string;
  icon?: string;
  to: string;
}[] = [
  { name: "Home", icon: HOME, to: "/dashboard" },
  { name: "Forum", icon: FORUM, to: "/forum" },
  { name: "Merchandise", icon: MERCHANDISE, to: "/merch" },
  { name: "Bulletin", icon: BULLETIN, to: "/bulletin" },
  { name: "Events", icon: EVENTS, to: "/events" },
  { name: "Resources", icon: RESOURCES, to: "/resources" },
  { name: "Showcase", icon: SHOWCASE, to: "/showcase" },
  { name: "Contact us", icon: "", to: "/contact-us" },
];
