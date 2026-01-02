import { FiSearch, FiMic } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div className="flex items-center w-full max-w-xl border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">
      
      <input
        type="text"
        placeholder="Search"
        className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 px-2"
      />

      <button className="text-gray-500 hover:text-black px-2">
        <FiSearch size={20} />
      </button>

      <button className="text-gray-500 hover:text-black px-2">
        <FiMic size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
