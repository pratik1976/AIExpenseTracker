import React, { useState } from "react";
import { createExpense } from "../api/expenseApi";

const initial = {
  store: "",
  amount: "",
  category: "other",
  expense_date: new Date().toISOString().slice(0, 10),
};

export default function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createExpense(form);
      setForm(initial);
      onCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save expense");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="section-heading">
        <div><span className="eyebrow">Manual entry</span><h2>Add expense</h2></div>
      </div>
      <form onSubmit={submit} className="form-grid">
        <label>Store / Merchant<input name="store" value={form.store} onChange={change} placeholder="e.g. Starbucks" required /></label>
        <label>Amount<input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={change} placeholder="0.00" required /></label>
        <label>Category
          <select name="category" value={form.category} onChange={change}>
            <option value="food">Food</option><option value="transport">Transport</option>
            <option value="shopping">Shopping</option><option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>Date<input name="expense_date" type="date" value={form.expense_date} onChange={change} required /></label>
        <div className="form-submit"><button className="btn primary" disabled={saving}>{saving ? "Saving..." : "Add expense"}</button></div>
      </form>
      {error && <div className="error-box">{error}</div>}
    </div>
  );
}
