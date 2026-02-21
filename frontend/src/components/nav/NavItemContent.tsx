import React from "react";
import ActiveIndicator from "./ActiveIndicator";

interface NavItemContentProps {
  isActive: boolean;
  icon?: string;
  name: string;
}

const NavItemContent: React.FC<NavItemContentProps> = ({
  isActive,
  icon,
  name,
}) => (
  <div className="relative flex items-center">
    {isActive && <ActiveIndicator />}
    {isActive && icon && <img src={icon} alt="" className="w-5 h-5 mr-2" />}
    <span>{name}</span>
  </div>
);

export default NavItemContent;
