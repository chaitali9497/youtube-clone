function FilterBar({ activeFilter, setActiveFilter }) {
  const filters = [
    "All",
    "React",
    "React Router",
    "JavaScript",
    "Node",
    "MongoDB",
    "Tailwind",
    "Interview",
    "Redux",
    "Backend",
  ];

  return (
    <div className="sticky top-14 z-40 bg-white">
      <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition
              ${
                activeFilter === filter
                  ? "bg-black text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
