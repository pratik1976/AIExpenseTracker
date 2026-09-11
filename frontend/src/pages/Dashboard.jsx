import React, { useEffect, useState } from "react";
import { BarChart3, CalendarDays, Receipt, Wallet, Sparkles } from "lucide-react";
import { getAiInsights, getDashboard } from "../api/expenseApi";
import StatCard from "../components/StatCard";

const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try { setData(await getDashboard()); }
    catch (err) { setError(err.response?.data?.message || "Could not load dashboard"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const runInsights = async () => {
    setAiLoading(true);
    try { setInsights(await getAiInsights()); }
    catch (err) { setError(err.response?.data?.message || "AI insights failed"); }
    finally { setAiLoading(false); }
  };

  if (loading) return <div className="page-loader">Loading dashboard...</div>;
  if (!data) return <div className="error-box">{error}</div>;

  const maxMonth = Math.max(...data.monthly.map(x => Number(x.total)), 1);
  const maxCat = Math.max(...data.categories.map(x => Number(x.total)), 1);

  return <div className="page">
    <header className="page-header">
      <div><span className="eyebrow">Overview</span><h1>Dashboard</h1><p>Your spending at a glance.</p></div>
    </header>

    <div className="stats-grid">
      <StatCard icon={Wallet} label="Total spending" value={money(data.summary.total_spending)} />
      <StatCard icon={CalendarDays} label="This month" value={money(data.summary.current_month_spending)} accent="blue" />
      <StatCard icon={Receipt} label="Average receipt" value={money(data.summary.average_receipt)} accent="purple" />
      <StatCard icon={BarChart3} label="Transactions" value={data.summary.transaction_count} accent="orange" />
    </div>

    <div className="dashboard-grid">
      <div className="card chart-card">
        <div className="section-heading"><div><span className="eyebrow">Trend</span><h2>Monthly spending</h2></div></div>
        <div className="bar-chart">
          {data.monthly.length ? data.monthly.map((m) => (
            <div className="bar-col" key={m.month}>
              <span className="bar-value">{money(m.total)}</span>
              <div className="bar-track"><div className="bar-fill" style={{height: `${Math.max((Number(m.total)/maxMonth)*100, 4)}%`}} /></div>
              <span>{m.month}</span>
            </div>
          )) : <div className="empty-state">No spending data yet.</div>}
        </div>
      </div>

      <div className="card chart-card">
        <div className="section-heading"><div><span className="eyebrow">Breakdown</span><h2>By category</h2></div></div>
        {data.categories.length ? <div className="category-list">
          {data.categories.map((c) => <div className="category-row" key={c.category}>
            <div className="category-label"><span className={`category-dot ${c.category}`}/><span>{c.category}</span></div>
            <div className="category-meter"><div style={{width:`${(Number(c.total)/maxCat)*100}%`}}/></div>
            <strong>{money(c.total)}</strong>
          </div>)}
        </div> : <div className="empty-state">No categories yet.</div>}
      </div>
    </div>

    <div className="dashboard-grid lower">
      <div className="card">
        <div className="section-heading"><div><span className="eyebrow">Latest</span><h2>Recent expenses</h2></div></div>
        {data.recent.length ? <div className="recent-list">{data.recent.map(e => <div className="recent-row" key={e.id}>
          <div><strong>{e.store}</strong><span>{e.category} · {new Date(e.expense_date).toLocaleDateString("en-IN")}</span></div>
          <strong>{money(e.amount)}</strong>
        </div>)}</div> : <div className="empty-state">No expenses yet. Scan a receipt to get started.</div>}
      </div>

      <div className="card ai-card">
        <div className="section-heading"><div><span className="eyebrow">AI assistant</span><h2>Spending insights</h2></div><Sparkles size={20}/></div>
        {!insights ? <div><p className="muted">Get a concise analysis of your recent spending, top category and one practical saving suggestion.</p><button className="btn primary" onClick={runInsights} disabled={aiLoading}>{aiLoading ? "Analyzing..." : "Analyze my spending"}</button></div> :
        <div className="insights"><p>{insights.summary}</p><div className="insight-pill"><span>Top category</span><strong>{insights.topCategory || "—"}</strong></div><p><strong>Observation:</strong> {insights.observation}</p><p><strong>Tip:</strong> {insights.savingTip}</p></div>}
      </div>
    </div>
    {error && <div className="error-box">{error}</div>}
  </div>;
}
