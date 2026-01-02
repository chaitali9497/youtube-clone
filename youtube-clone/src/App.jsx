import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const hasVideos = false;

  return (
    <>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      <main
  className={`pt-20 transition-all duration-300 bg-gray-50 min-h-screen
  ${sidebarOpen ? "ml-60" : "ml-20"}`}
>
  {hasVideos ? <VideoGrid /> : <Home />}
</main>
    </>
  );
}

export default App;
