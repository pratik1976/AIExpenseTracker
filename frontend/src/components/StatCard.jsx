import React from "react";

export default function StatCard({ icon: Icon, label, value, accent = "green", sub }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${accent}`}><Icon size={20} /></div>
      <div>
        <span className="muted-label">{label}</span>
        <h3>{value}</h3>
        {sub && <small>{sub}</small>}
      </div>
    </div>
  );
}
