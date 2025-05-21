import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Image,
  UserCircle2,
  Newspaper,
  Settings,
  Mails,
  ListOrdered,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menus = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Banner", icon: Image, path: "/banner" },
    { label: "Artist", icon: UserCircle2, path: "/artist" },
    { label: "Show LineUps", icon: ListOrdered, path: "/show-lineup" },
    { label: "News", icon: Newspaper, path: "/news" },
    { label: "Contact Us", icon: Mails, path: "/contact-us" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-6 left-4 z-[51] bg-white p-2 rounded shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white text-gray-700 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-lg 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <div className="p-4 border-b bordr-gray-400 flex items-center justify-center">
          <img
            src="/thaalam-logo.png"
            alt="thaalam subscription logo"
            className="h-24 w-24"
          />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menus.map(({ label, icon: Icon, path }) => (
            <NavLink
              to={path}
              key={label}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded p-3 transition-all duration-300 ${
                  isActive
                    ? "bg-primary-500 text-secondary-50"
                    : "hover:bg-secondary-100 text-gray-700"
                }`
              }
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
