
export default function SearchFilter({
  value,
  onSearch,
  filter,
  onFilter,
  options,
  placeholder = "Search records..."
}) {
  return (
    <div className="search-filter">
      <label className="search-box">
        <span>⌕</span>
        <input
          value={value}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={placeholder}
        />
      </label>

      {options && (
        <select
          value={filter}
          onChange={(event) => onFilter(event.target.value)}
        >
          <option value="All">All categories</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
