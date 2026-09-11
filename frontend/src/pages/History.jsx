import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Search, Trash2, SlidersHorizontal } from "lucide-react";
import { deleteExpense, getExpenses, updateExpense } from "../api/expenseApi";
import EditExpenseModal from "../components/EditExpenseModal";

const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function History() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("date_desc");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const load = async () => {
    setLoading(true);
    try { setExpenses(await getExpenses()); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const rows = expenses.filter(e =>
      (!query || e.store.toLowerCase().includes(query.toLowerCase())) &&
      (category === "all" || e.category === category)
    );
    return [...rows].sort((a,b) => {
      if (sort === "amount_desc") return Number(b.amount)-Number(a.amount);
      if (sort === "amount_asc") return Number(a.amount)-Number(b.amount);
      if (sort === "date_asc") return new Date(a.expense_date)-new Date(b.expense_date);
      return new Date(b.expense_date)-new Date(a.expense_date);
    });
  }, [expenses, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page-1)*pageSize, page*pageSize);

  useEffect(() => setPage(1), [query, category, sort]);

  const remove = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const saveEdit = async (form) => {
    setSaving(true);
    try {
      const updated = await updateExpense(editing.id, form);
      setExpenses(prev => prev.map(e => e.id === editing.id ? updated : e));
      setEditing(null);
    } finally { setSaving(false); }
  };

  return <div className="page">
    <header className="page-header"><div><span className="eyebrow">Transactions</span><h1>History</h1><p>Search, filter and manage your expenses.</p></div></header>

    <div className="card filters">
      <div className="search-box"><Search size={17}/><input placeholder="Search merchant..." value={query} onChange={e => setQuery(e.target.value)}/></div>
      <div className="filter-control"><SlidersHorizontal size={16}/><select value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option><option value="food">Food</option><option value="transport">Transport</option><option value="shopping">Shopping</option><option value="utilities">Utilities</option><option value="other">Other</option></select></div>
      <select value={sort} onChange={e => setSort(e.target.value)}><option value="date_desc">Newest</option><option value="date_asc">Oldest</option><option value="amount_desc">Highest amount</option><option value="amount_asc">Lowest amount</option></select>
    </div>

    <div className="card">
      {loading ? <div className="page-loader">Loading expenses...</div> :
       !visible.length ? <div className="empty-state"><div className="empty-icon">🧾</div><h3>No expenses found</h3><p>Try changing your filters or scan a receipt.</p></div> :
       <div className="expense-table">
         {visible.map(e => <div className="expense-row" key={e.id}>
           <div className={`expense-icon ${e.category}`}>{e.category === "food" ? "🍔" : e.category === "transport" ? "🚗" : e.category === "shopping" ? "🛍️" : e.category === "utilities" ? "💡" : "📦"}</div>
           <div className="expense-main"><strong>{e.store}</strong><span>{e.category} · {new Date(e.expense_date).toLocaleDateString("en-IN")}</span></div>
           <strong className="expense-amount">{money(e.amount)}</strong>
           <button className="icon-btn edit" title="Edit" onClick={() => setEditing(e)}><Pencil size={16}/></button>
           <button className="icon-btn danger" title="Delete" onClick={() => remove(e.id)}><Trash2 size={16}/></button>
         </div>)}
       </div>}
    </div>

    {totalPages > 1 && <div className="pagination"><button className="btn secondary" disabled={page===1} onClick={() => setPage(p=>p-1)}>Previous</button><span>Page {page} of {totalPages}</span><button className="btn secondary" disabled={page===totalPages} onClick={() => setPage(p=>p+1)}>Next</button></div>}

    <EditExpenseModal expense={editing} onClose={() => setEditing(null)} onSave={saveEdit} saving={saving}/>
  </div>;
}
