import {
  FiMenu,
  FiSearch,
  FiPlus,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./Searchbar";
import api from "../utils/axios";
import Avatar, { getAvatarFromName } from "../components/Avatar";
import youtubelogo from "../assets/youtube.png";

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  /* CLOSE USER MENU ON OUTSIDE CLICK */
  useEffect(() => {
    const close = () => setShowUserMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  /* LOCK BACKGROUND SCROLL FOR MOBILE SEARCH */
  useEffect(() => {
    if (showMobileSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileSearch]);

  /* SYNC CHANNEL INFO */
  useEffect(() => {
    const syncChannel = async () => {
      try {
        const res = await api.get("/channels/me");
        const channel = res.data?.channel || res.data;
        if (!channel?._id) return;

        const updatedUser = {
          ...user,
          channel: { _id: channel._id },
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch {}
    };

    if (isLoggedIn && user && !user?.channel?._id) {
      syncChannel();
    }
  }, [isLoggedIn, user]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white flex items-center px-3 z-50">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <FiMenu
            className="text-2xl cursor-pointer"
            onClick={toggleSidebar}
          />

          <div
            onClick={() => navigate("/", { replace: true })}
            className="flex items-center cursor-pointer"
          >
            <img src={youtubelogo} alt="YouTube" className="h-8" />
          </div>
        </div>

        {/* CENTER SEARCH (DESKTOP) */}
        <div className="hidden md:flex flex-1 justify-center px-6">
          <SearchBar />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 ml-auto">
          {/* MOBILE SEARCH */}
          <button
            className="md:hidden p-2"
            onClick={() => setShowMobileSearch(true)}
          >
            <FiSearch className="text-xl" />
          </button>

          {isLoggedIn && (
            <>
              <button
                onClick={() => navigate("/upload", { replace: true })}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 border rounded-full hover:bg-gray-100"
              >
                <FiPlus />
                <span className="text-sm">Create</span>
              </button>

              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <FiBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </>
          )}

          {/* USER MENU */}
          {isLoggedIn ? (
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu((p) => !p);
                }}
              >
                <Avatar
                  name={user?.name || user?.email || "User"}
                  src={
                    user?.avatar ||
                    getAvatarFromName(
                      user?.name || user?.email || "User"
                    )
                  }
                  size={32}
                />
              </div>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* USER INFO */}
                  <div className="flex gap-3 p-4">
                    <Avatar
                      name={user?.name || user?.email || "User"}
                      src={
                        user?.avatar ||
                        getAvatarFromName(
                          user?.name || user?.email || "User"
                        )
                      }
                      size={40}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user?.name || "User"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {user?.email}
                      </span>

                      {user?.channel?._id ? (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate(
                              `/channel/${user.channel._id}`,
                              { replace: true }
                            );
                          }}
                          className="text-sm text-blue-600 mt-1 text-left hover:underline"
                        >
                          View your channel
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate("/create-channel", {
                              replace: true,
                            });
                          }}
                          className="text-sm text-blue-600 mt-1 text-left hover:underline"
                        >
                          Create a channel
                        </button>
                      )}
                    </div>
                  </div>

                  <hr />

                  <MenuItem
                    icon={<FiLogOut />}
                    text="Sign out"
                    danger
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login", { replace: true });
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="border px-4 py-1.5 rounded-full"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* ================= MOBILE SEARCH OVERLAY ================= */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-60 flex flex-col bg-white">
          <div className="flex items-center gap-2 px-2 h-11 border-b shrink-0">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-1 text-lg"
            >
              <IoMdArrowBack />
            </button>

            <div className="flex-1">
              <SearchBar mobile />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" />
        </div>
      )}
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
