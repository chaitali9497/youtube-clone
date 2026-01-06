// src/Layout/Main.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      <main
        className={`pt-14 transition-all duration-300  min-h-screen
        ${sidebarOpen ? "ml-60" : "ml-20"}`}
      >
        <Outlet />
      </main>
    </>
  );
}

export default Main;
