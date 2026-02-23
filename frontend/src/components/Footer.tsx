import FACEBOOKICON from "../assets/icons/facebok.svg";
import GITHUBICON from "../assets/icons/github.svg";
import DISCORDICON from "../assets/icons/discord.svg";
import MAILICON from "../assets/icons/mail.svg";
import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const FOOTERS = [
  {
    title: "Information",
    subs: ["Contact Us", "FAQs", "Privacy Policy", "Terms of Service"],
  },
  {
    title: "Location",
    subs: [
      "University of Cebu",
      "Main Campus 5th flr.",
      "Osmeña Blvd Cor.",
      "Sanciangko St. Cebu City",
    ],
  },
  {
    title: "Accreditation",
    subs: ["Student Affairs", "Office (SAO)"],
  },
  {
    title: "Others",
    subs: ["Forum", "Showcase", "Learning Materials", "Send Feedback"],
  },
];

const Footer = () => {
  const SOCIALS = [
    { name: "facebook", icon: FACEBOOKICON },
    { name: "mail", icon: GITHUBICON },
    { name: "discord", icon: DISCORDICON },
    { name: "github", icon: MAILICON },
  ];

  return (
    <footer className="bg-black w-full py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        <DesktopFooter />
        <MobileFooter />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 pt-6 md:pt-8 border-t border-white/10">
          <div>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/908b2c69e5ddf7149bfed18e966c01f1a0b71f4d?width=750"
              alt="CSPS Footer Logo"
              className="w-36 md:w-48 lg:w-60 h-auto"
            />
          </div>

          <div className="flex flex-col items-center lg:items-end gap-3 md:gap-4">
            {/* Social Media Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              {SOCIALS.map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-white hover:text-cs-gold transition-colors p-2"
                >
                  <img
                    src={icon.icon}
                    alt={icon.name}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </a>
              ))}
            </div>

            <div className="text-white text-xs md:text-sm text-center lg:text-right leading-relaxed">
              <span>Computing Society of the Philippines - Students</span>
              <span className="hidden lg:inline"> • </span>
              <span className="block lg:inline">
                University of Cebu - Main Campus
              </span>
              <span className="hidden lg:inline"> • </span>
              <span className="block lg:inline">© Copyright 2025</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const MobileFooter = () => {
  const [open, setOpen] = useState<number | null>(null);
  const handleFooterOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };
  return (
    <div className="block lg:hidden mb-12 text-white w-full">
      {FOOTERS.map((foot, index) => (
        <div
          className="w-full px-4 py-3 border-b border-white/10 last:border-b-0"
          key={index}
        >
          <button
            onClick={() => handleFooterOpen(index)}
            className="w-full text-left font-semibold text-lg flex justify-between items-center py-2"
          >
            {foot.title.toUpperCase()}
            <span className="text-white/60">
              {open === index ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </span>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: open === index ? "auto" : 0,
              opacity: open === index ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pt-2 pb-1">
              {foot.subs.map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-white/70 text-sm hover:text-white transition-colors block py-1"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      ))}
    </div>
  );
};

const DesktopFooter = () => {
  return (
    <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
      <div>
        <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
          INFORMATION
        </h4>
        <ul className="space-y-2 lg:space-y-3">
          {["Contact Us", "FAQs", "Privacy Policy", "Terms of Service"].map(
            (item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  {item}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>

      <div>
        <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
          LOCATION
        </h4>
        <p className="text-white text-sm lg:text-xl leading-relaxed">
          University of Cebu
          <br />
          Main Campus 5th flr.
          <br />
          Osmeña Blvd Cor.
          <br />
          Sanciangko St. Cebu City
        </p>
      </div>

      <div>
        <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
          ACCREDITATION
        </h4>
        <p className="text-white text-sm lg:text-xl leading-relaxed">
          Student Affairs
          <br />
          Office (SAO)
        </p>
      </div>

      <div>
        <h4 className="text-white text-lg lg:text-2xl font-semibold mb-4 lg:mb-6">
          OTHERS
        </h4>
        <ul className="space-y-2 lg:space-y-3">
          {["Forum", "Showcase", "Learning Materials", "Send Feedback"].map(
            (item, idx) => (
              <li key={idx}>
                <a
                  href="#"
                  className="text-white text-sm lg:text-xl hover:text-cs-gold transition-colors"
                >
                  {item}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
};
export default Footer;
