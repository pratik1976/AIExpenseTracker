import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WalletCards, Eye, EyeOff } from "lucide-react";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const data = await login(form);
      loginUser(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return <AuthPage title="Welcome back" subtitle="Sign in to continue managing your spending.">
    <form onSubmit={submit} className="auth-form">
      <label>Email<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="you@example.com" required /></label>
      <label>Password<div className="password-wrap"><input type={show ? "text" : "password"} value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="••••••••" required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
      {error && <div className="error-box">{error}</div>}
      <button className="btn primary full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
    <p className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></p>
  </AuthPage>;
}

function AuthPage({ title, subtitle, children }) {
  return <div className="auth-page">
    <div className="auth-brand"><div className="brand-mark"><WalletCards size={20}/></div><strong>SpendAI</strong></div>
    <div className="auth-card">
      <span className="eyebrow">AI Expense Tracker</span><h1>{title}</h1><p>{subtitle}</p>{children}
    </div>
  </div>;
}
