import React from "react";
import { NavLink } from "react-router-dom";
import "../css/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Dashboard-Hospital</h2>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
        <NavLink to="/patients" className={({ isActive }) => isActive ? "active" : ""}>Pacientes</NavLink>
        <NavLink to="/doctors" className={({ isActive }) => isActive ? "active" : ""}>Médicos</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
