import {FiMenu,FiSearch,FiPlus,FiBell,FiLogOut,FiUser,FiRepeat,} from "react-icons/fi";
import { useNavigate , Link} from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Searchbar";


function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);


  useEffect(() => {
    const close = () => setShowUserMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center px-3 z-50 mb-5">
        
        <div className="flex items-center gap-3">
          <FiMenu
            className="text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-1 cursor-pointer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
              alt="YouTube"
              className="h-5"
            />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <SearchBar />
        </div>

      
        <div className="flex items-center gap-2 ml-auto">
          {/* MOBILE SEARCH ICON */}
          <button
            className="md:hidden p-2"
            onClick={() => setShowMobileSearch(true)}
          >
            <FiSearch className="text-xl" />
          </button>

          {isLoggedIn && (
            <>
              {/* CREATE */}
              <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 border rounded-full hover:bg-gray-100">
                <FiPlus />
                <span className="text-sm">Create</span>
              </button>

              {/* NOTIFICATION */}
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <FiBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </>
          )}

          {/* AVATAR */}
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu((prev) => !prev);
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                    {user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* DROPDOWN */}
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* USER INFO */}
                  <div className="flex gap-3 p-4 ">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.name || "User"}
                      </span>
                      <span className="text-sm text-gray-500">
                        @{user?.username || "username"}
                      </span>
                     {user?.channel ? (
  <button
    onClick={() => navigate(`/channel/${user?.channel?._id}`)}

    className="text-sm text-blue-600 mt-1 text-left"
  >
    View your channel
  </button>
) : (
  <button
    onClick={() => navigate("/create-channel")}
    className="text-sm text-blue-600 mt-1 text-left"
  >
    Create a channel
  </button>
)}

                    </div>
                  </div>
                  

                  <div className=" py-2">
                    <MenuItem
                      icon={<FiLogOut />}
                      text="Sign out"
                      danger
                      onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
             <Link
              to="/login"
              className="
                flex items-center gap-2
                border border-blue-500
                text-blue-500
                px-4 py-1.5
                rounded-full
                hover:bg-blue-50
                transition
              "
            >
              {/* User Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-60 flex items-center px-3">
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xl mr-3"
          >
            ←
          </button>
          <div className="flex-1">
            <SearchBar />
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Menu Item ---------- */
const MenuItem = ({ icon, text, onClick, arrow, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 ${
      danger ? "text-red-600" : ""
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1 text-left">{text}</span>
    {arrow && <span className="text-gray-400">›</span>}
  </button>
);

export default Navbar;
