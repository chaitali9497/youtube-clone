import {
  FiSearch,
  FiMic,
  FiClock
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const MAX_RECENTS = 8;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* LOAD RECENT SEARCHES */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  /* FETCH SUGGESTIONS FROM BACKEND */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await api.get(
          `/api/videos?search=${query}`
        );
        setSuggestions(res.data.slice(0, 6));
      } catch (error) {
        console.error("Search failed", error);
      }
    };

    fetchSuggestions();
  }, [query]);

  /* OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /* SAVE RECENT */
  const saveRecentSearch = text => {
    const updated = [
      text,
      ...recentSearches.filter(item => item !== text),
    ].slice(0, MAX_RECENTS);

    setRecentSearches(updated);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updated)
    );
  };

  /* SEARCH HANDLER */
  const handleSearch = (text = query) => {
    if (!text.trim()) return;
    saveRecentSearch(text);
    navigate(`/?q=${text}`);
    setIsFocused(false);
    setSuggestions([]);
  };

  const showRecent =
    isFocused && query === "" && recentSearches.length > 0;

  const showSuggestions =
    isFocused && query !== "" && suggestions.length > 0;

  return (
    <div
      className="relative w-full max-w-2xl"
      ref={dropdownRef}
    >
      {/* SEARCH BAR */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 h-10 border border-gray-300 rounded-full overflow-hidden bg-white">
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={e =>
              e.key === "Enter" && handleSearch()
            }
            className="flex-1 px-4 text-sm outline-none"
          />

          <button
            onClick={() => handleSearch()}
            className="w-14 flex items-center justify-center border-gray-300 bg-gray-100 hover:bg-gray-200"
          >
            <FiSearch size={18} />
          </button>
        </div>

        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
          <FiMic size={18} />
        </button>
      </div>

      {/* DROPDOWN */}
      {(showRecent || showSuggestions) && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {/* RECENT SEARCHES */}
          {showRecent &&
            recentSearches.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSearch(item)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FiClock className="text-gray-500" />
                <span className="text-sm line-clamp-1">
                  {item}
                </span>
              </div>
            ))}

          {/* SUGGESTIONS */}
          {showSuggestions &&
            suggestions.map(video => (
              <div
                key={video._id}
                onClick={() => handleSearch(video.title)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <FiSearch className="text-gray-500" />
                <span className="text-sm line-clamp-1">
                  {video.title}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
