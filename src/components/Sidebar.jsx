import {
  CalendarDays,
  LayoutDashboard,
  Stethoscope,
  Users,
  HeartPulse,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/patients",
    label: "Patients",
    icon: Users,
  },
  {
    to: "/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    to: "/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <HeartPulse size={23} />
        </div>

        <div>
          <strong>CuraCare</strong>
          <span>HOSPITAL SYSTEM</span>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>

            {label === "Appointments" && (
              <span className="nav-count">3</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar">AD</div>

        <div>
          <strong>Admin Desk</strong>
          <span>Hospital administrator</span>
        </div>

        <span className="more-dots">•••</span>
      </div>
    </aside>
  );
}