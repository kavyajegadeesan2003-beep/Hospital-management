import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarDays,
  Bell,
  ChevronRight,
  LogOut,
  X,
  MoreVertical,
  UserRound,
  Settings,
  CircleHelp
} from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  function handleSearch(event) {
    event.preventDefault();

    const query = searchText.trim();

    if (query) {
      navigate(`/patients?search=${encodeURIComponent(query)}`);
    }
  }

  function handleDateChange(event) {
    const date = event.target.value;
    setSelectedDate(date);

    if (date) {
      navigate(`/appointments?date=${date}`);
      setShowCalendar(false);
    }
  }

  function handleLogout() {
    setShowMenu(false);
    navigate("/login", { replace: true });
  }

  function handleMenuItem(item) {
    setShowMenu(false);

    if (item === "My Profile") {
      navigate("/profile");
    } else if (item === "Settings") {
      navigate("/settings");
    } else if (item === "Help & Support") {
      navigate("/help");
    }
  }

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <ChevronRight size={14} />
        <strong>Hospital Management</strong>
      </div>

      <div className="topbar-actions">
        {/* Search */}
        <form className="top-search" onSubmit={handleSearch}>
          <button type="submit" aria-label="Search">
            <Search size={18} />
          </button>

          <input
            type="search"
            placeholder="Search patients..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          {searchText && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchText("")}
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Calendar */}
        <div className="header-calendar">
          <button
            type="button"
            className="icon-button"
            aria-label="Open calendar"
            title="Open calendar"
            onClick={() => setShowCalendar((previous) => !previous)}
          >
            <CalendarDays size={19} />
          </button>

          {showCalendar && (
            <input
              type="date"
              className="calendar-date-input"
              aria-label="Select appointment date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="icon-button notification"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
          <i />
        </button>

        {/* Current Date */}
        <div className="top-date">
          <span>{formattedDate}</span>
        </div>

        {/* Three-dot Menu */}
        <div className="header-menu">
          <button
            type="button"
            className="icon-button"
            aria-label="Open menu"
            title="More options"
            aria-expanded={showMenu}
            onClick={() => setShowMenu((previous) => !previous)}
          >
            <MoreVertical size={21} />
          </button>

          {showMenu && (
            <div className="header-dropdown">
              <button
                type="button"
                onClick={() => handleMenuItem("My Profile")}
              >
                <UserRound size={17} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => handleMenuItem("Settings")}
              >
                <Settings size={17} />
                <span>Settings</span>
              </button>

              <button
                type="button"
                onClick={() => handleMenuItem("Help & Support")}
              >
                <CircleHelp size={17} />
                <span>Help &amp; Support</span>
              </button>
            </div>
          )}
        </div>

        {/* Separate Logout Button */}
        <button
          type="button"
          className="header-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
