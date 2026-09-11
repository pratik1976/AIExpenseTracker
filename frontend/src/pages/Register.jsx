import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletCards } from "lucide-react";
import { register } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await register(form);
      loginUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return <div className="auth-page">
    <div className="auth-brand"><div className="brand-mark"><WalletCards size={20}/></div><strong>SpendAI</strong></div>
    <div className="auth-card">
      <span className="eyebrow">Get started</span><h1>Create your account</h1><p>Track expenses and turn receipts into useful insights.</p>
      <form onSubmit={submit} className="auth-form">
        <label>Full name<input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Your name" required /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com" required /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="At least 6 characters" minLength={6} required /></label>
        {error && <div className="error-box">{error}</div>}
        <button className="btn primary full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
      </form>
      <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  </div>;
}
