import {
  FiMenu,
  FiMoreVertical,
  FiUser,
  FiPlus,
  FiBell,
} from "react-icons/fi";
import SearchBar from "./Searchbar";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white  flex items-center px-4 z-50">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <FiMenu
          className="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded-full"
          onClick={toggleSidebar}
        />
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-red-600 cursor-pointer"
        >
          YouTube
        </h1>
      </div>

      {/* CENTER */}
      <div className="flex flex-1 justify-center px-4">
        <SearchBar />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* More icon */}
        <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <FiMoreVertical className="text-xl text-gray-700" />
        </div>

        {/* AUTH SECTION */}
        {!isLoggedIn ? (
          //  BEFORE LOGIN
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full text-blue-600 hover:bg-blue-50"
          >
            <FiUser className="text-lg" />
            <span className="text-sm font-medium">Sign in</span>
          </button>
        ) : (
          //  AFTER LOGIN
          <>
            {/* Create */}
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-100">
              <FiPlus className="text-gray-700" />
              <span className="text-sm text-gray-700">Create</span>
            </button>

            {/* Notifications */}
            <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <FiBell className="text-xl text-gray-700" />
            </div>

            {/* Profile */}
            <div className="relative group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md hidden group-hover:block">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </header>
  );
}

export default Navbar;
