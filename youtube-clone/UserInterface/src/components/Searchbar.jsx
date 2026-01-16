import { FiSearch, FiMic, FiClock, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../utils/axios";

const MAX_RECENTS = 8;

const SearchBar = ({ mobile = false }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  /*  SYNC INPUT WITH URL (?q=...) */
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  /*  AUTO FOCUS ON MOBILE */
  useEffect(() => {
    if (mobile) {
      setIsFocused(true);
      inputRef.current?.focus();
    }
  }, [mobile]);

  /* LOAD RECENTS */
  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  /* FETCH SUGGESTIONS */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/videos?search=${query}`);
        setSuggestions((res.data || []).slice(0, 8));
      } catch {}
    };

    fetchSuggestions();
  }, [query]);

  /* OUTSIDE CLICK (DESKTOP ONLY) */
  useEffect(() => {
    if (mobile) return;

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
  }, [mobile]);

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

  /* SEARCH */
  const handleSearch = (text = query) => {
    if (!text.trim()) return;
    saveRecentSearch(text);
    navigate(`/?q=${encodeURIComponent(text)}`);
    setIsFocused(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  /* CLEAR */
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    navigate("/", { replace: true });
    inputRef.current?.focus();
  };

  const showRecent =
    isFocused && query === "" && recentSearches.length > 0;

  const showSuggestions =
    isFocused && query !== "" && suggestions.length > 0;

  return (
    <div
      ref={dropdownRef}
      className={`w-full ${mobile ? "" : "relative max-w-2xl mx-auto"}`}
    >
      {/* SEARCH INPUT */}
      <div className="flex items-center gap-2">
        <div className="relative flex flex-1 h-10 border border-gray-300 rounded-full bg-white overflow-hidden">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={e =>
              e.key === "Enter" && handleSearch()
            }
            className="flex-1 px-4 pr-14 text-sm outline-none"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200"
            >
              <FiX size={16} />
            </button>
          )}

          <button
            onClick={() => handleSearch()}
            className="w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200"
          >
            <FiSearch size={18} />
          </button>
        </div>

        {!mobile && (
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <FiMic size={18} />
          </button>
        )}
      </div>

      {/* DROPDOWN / FULL PANEL */}
      {(showRecent || showSuggestions) && (
        <div
          className={
            mobile
              ? "fixed inset-0 top-14 bg-white z-60 overflow-y-auto"
              : "absolute top-full mt-2 left-0 w-full bg-white border rounded-xl shadow-lg z-50 max-h-[60vh] overflow-y-auto"
          }
        >
          {showRecent &&
            recentSearches.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSearch(item)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                <FiClock className="text-gray-500" />
                <span className="text-sm">{item}</span>
              </div>
            ))}

          {showSuggestions &&
            suggestions.map(video => (
              <div
                key={video._id}
                onClick={() => handleSearch(video.title)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                <FiSearch className="text-gray-500" />
                <span className="text-sm">{video.title}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
