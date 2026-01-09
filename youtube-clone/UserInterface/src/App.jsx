import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      <main
        className={`pt-14 transition-all duration-300 bg-gray-50 min-h-screen
        ${sidebarOpen ? "ml-60" : "ml-20"}`}
      >
        <Outlet />
      </main>
    </>
  );
}

export default App;
