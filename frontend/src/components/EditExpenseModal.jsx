import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const initial = { store: "", amount: "", category: "other", expense_date: "", receipt_url: "" };

export default function EditExpenseModal({ expense, onClose, onSave, saving }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    if (expense) {
      setForm({
        store: expense.store || "",
        amount: expense.amount ?? "",
        category: expense.category || "other",
        expense_date: expense.expense_date?.slice(0, 10) || "",
        receipt_url: expense.receipt_url || "",
      });
    }
  }, [expense]);

  if (!expense) return null;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">Expense</span>
            <h2>Edit expense</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
          <label>Store / Merchant<input name="store" value={form.store} onChange={change} required /></label>
          <div className="two-col">
            <label>Amount<input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={change} required /></label>
            <label>Date<input name="expense_date" type="date" value={form.expense_date} onChange={change} required /></label>
          </div>
          <label>Category
            <select name="category" value={form.category} onChange={change}>
              <option value="food">Food</option>
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
