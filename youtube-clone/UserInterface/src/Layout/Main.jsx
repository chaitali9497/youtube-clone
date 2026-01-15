// src/Layout/Main.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function Main() {
  const location = useLocation();
  const isWatchPage = location.pathname.startsWith("/watch");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  //  Open sidebar by default ONLY on desktop AND NOT on watch page
  useEffect(() => {
    if (isWatchPage) {
      setSidebarOpen(false);
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    setSidebarOpen(isDesktop);
  }, [isWatchPage]);

  return (
    <>
      <Navbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isWatchPage={isWatchPage}
      />

      {/* Sidebar hidden from layout on watch page */}
      {!isWatchPage && <Sidebar isOpen={sidebarOpen} />}

      <main
        className={`pt-14 transition-all duration-300 min-h-screen
          ${
            isWatchPage
              ? "ml-0"
              : sidebarOpen
              ? "md:ml-60 ml-0"
              : "md:ml-20 ml-0"
          }
        `}
      >
        <Outlet />
      </main>
    </>
  );
}

export default Main;
