import { useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-end md:justify-between items-center bg-white px-6 py-4 relative">
      <h5 className="hidden md:block text-xl font-semibold text-gray-600">
        Summer Festival 2025
      </h5>
      <div
        className="relative flex items-center space-x-4"
        onClick={() => setShowMenu(!showMenu)}
      >
        <h5 className="text-gray-700 font-medium">Admin</h5>
        <img
          src="https://thaalam.ch/newfile/subscription/assets/img/user1.jpg"
          alt="admin profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
        {showMenu && (
          <div
            className="absolute right-0 top-14 bg-white shadow-lg rounded-lg w-40 py-2 z-20 border"
            onClick={() => setShowMenu(false)}
          >
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-10 w-full"
            >
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 w-full"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
