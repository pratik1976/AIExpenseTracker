import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../api/authApi";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try { setProfile(await getMe()); } finally { setLoading(false); }
  };

  return <div className="page narrow">
    <header className="page-header"><div><span className="eyebrow">Account</span><h1>Profile</h1><p>Your account information.</p></div></header>
    <div className="card profile-card">
      <div className="large-avatar">{profile?.name?.charAt(0)?.toUpperCase()}</div>
      <h2>{profile?.name}</h2>
      <p>{profile?.email}</p>
      <div className="profile-meta"><span>Member since</span><strong>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN") : "—"}</strong></div>
      <button className="btn secondary" onClick={refresh}>{loading ? "Refreshing..." : "Refresh profile"}</button>
    </div>
  </div>;
}
