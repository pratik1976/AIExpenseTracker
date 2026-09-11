import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, History, ScanLine, UserCircle, LogOut, WalletCards } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/scan", label: "Scan Receipt", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><WalletCards size={20} /></div>
          <div>
            <strong>SpendAI</strong>
            <span>Expense Tracker</span>
          </div>
        </div>

        <nav className="nav-list">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-user">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className="truncate">
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => { logout(); navigate("/login"); }}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
