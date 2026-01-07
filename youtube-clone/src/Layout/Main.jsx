// src/Layout/Main.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  //  Check if current page is Watch
  const isWatchPage = location.pathname.startsWith("/watch");

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/*  Sidebar hidden on Watch page */}
      {!isWatchPage && <Sidebar isOpen={sidebarOpen} />}

      <main
        className={`pt-14 transition-all duration-300 min-h-screen
        ${
          isWatchPage
            ? "ml-0" 
            : sidebarOpen
            ? "ml-60"
            : "ml-20"
        }`}
      >
        <Outlet />
      </main>
    </>
  );
}

export default Main;
