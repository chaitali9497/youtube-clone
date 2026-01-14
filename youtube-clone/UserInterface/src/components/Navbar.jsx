import {
  FiMenu,
  FiSearch,
  FiPlus,
  FiBell,
  FiLogOut
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Searchbar";
import api from "../utils/axios"; 

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  //  user must be STATE, not const
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const close = () => setShowUserMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const syncChannel = async () => {
      try {
        const res = await api.get("/channels/me");

        // normalize backend response
        const channel = res.data?.channel || res.data;
        if (!channel || !channel._id) return;

        const updatedUser = {
          ...user,
          channel: { _id: channel._id }
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch {
        // no channel → ignore
      }
    };

    if (isLoggedIn && user && !user?.channel?._id) {
      syncChannel();
    }
  }, [isLoggedIn, user]);
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center px-3 z-50">
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

        <div className="hidden md:flex flex-1 justify-center px-6">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            className="md:hidden p-2"
            onClick={() => setShowMobileSearch(true)}
          >
            <FiSearch className="text-xl" />
          </button>

          {isLoggedIn && (
            <>
              <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 border rounded-full hover:bg-gray-100">
                <FiPlus />
                <span className="text-sm">Create</span>
              </button>

              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <FiBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </>
          )}

          {isLoggedIn ? (
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu((prev) => !prev);
                }}
              >
                <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              </div>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                      {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.name || "User"}
                      </span>

                      {user?.channel ? (
                        <button
                          onClick={() =>
                            navigate(`/channel/${user.channel._id}`)
                          }
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
              )}
            </div>
          ) : (
            <Link to="/login" className="border px-4 py-1.5 rounded-full">
              Sign in
            </Link>
          )}
        </div>
      </header>
    </>
  );
}

const MenuItem = ({ icon, text, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 ${
      danger ? "text-red-600" : ""
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1 text-left">{text}</span>
  </button>
);

export default Navbar;
