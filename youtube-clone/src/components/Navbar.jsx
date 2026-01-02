import { FiMenu, FiVideo, FiBell,FiMoreVertical, FiUser } from "react-icons/fi";
import SearchBar from "./Searchbar";

function Navbar({ toggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center px-4 z-50">
      
      <div className="flex items-center gap-4">
        <FiMenu
          className="text-xl cursor-pointer hover:bg-gray-100 p-1 rounded-full"
          onClick={toggleSidebar}
        />
        <h1 className="text-xl font-bold text-red-600 cursor-pointer">
          YouTube
        </h1>
      </div>

      <div className="flex flex-1 justify-center px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
  
  <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
    <FiMoreVertical className="text-xl" />
  </div>

  <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full text-blue-600 hover:bg-blue-50">
    <FiUser className="text-lg" />
    <span className="text-sm font-medium">Sign in</span>
  </button>

</div>
    </header>
  );
}

function IconWrapper({ children }) {
  return (
    <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
      {children}
    </div>
  );
}

export default Navbar;
