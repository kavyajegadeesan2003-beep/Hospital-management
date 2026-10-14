import { Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import LoadingSpinner from "./LoadingSpinner";

export default function AppLayout() {
  const { loading } = useApp();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell"><Header /><main className="main-content"><Outlet /></main><footer className="app-footer">© 2026 CarePoint Health Systems <span></span></footer></div>
      {loading && <div className="loading-overlay"><LoadingSpinner /></div>}
    </div>
  );
}
