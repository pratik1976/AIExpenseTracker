import React, { useRef, useState } from "react";
import { Camera, Check, RotateCcw, Sparkles, Upload } from "lucide-react";
import { scanReceipt } from "../api/expenseApi";
import { createExpense } from "../api/expenseApi";

export default function ReceiptUploader({ onSaved }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const choose = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) return setError("Please choose an image file.");
    if (selected.size > 10 * 1024 * 1024) return setError("Image must be smaller than 10 MB.");
    setError("");
    setFile(selected);
    setResult(null);
    setPreview(URL.createObjectURL(selected));
  };

  const scan = async () => {
    if (!file) return;
    setScanning(true);
    setError("");
    try {
      const base64 = await fileToBase64(file);
      const data = await scanReceipt(base64.split(",")[1], file.type);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Receipt scanning failed.");
    } finally {
      setScanning(false);
    }
  };

  const save = async () => {
    if (!result) return;
    setSaving(true);
    setError("");
    try {
      await createExpense({
        store: result.store || "Unknown Store",
        amount: Number(result.total || 0),
        category: result.category || "other",
        expense_date: result.date || new Date().toISOString().slice(0, 10),
      });
      onSaved?.();
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save scanned expense.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setPreview("");
    setFile(null);
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="scan-layout">
      <div className="card upload-card">
        <div className="scan-drop" onClick={() => inputRef.current?.click()}>
          {preview ? <img src={preview} alt="Receipt preview" /> : (
            <>
              <div className="upload-icon"><Camera size={28} /></div>
              <h3>Upload a receipt</h3>
              <p>PNG, JPG or WEBP · up to 10 MB</p>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={choose} hidden />

        <div className="scan-actions">
          <button className="btn secondary" onClick={() => inputRef.current?.click()}><Upload size={17}/> Choose image</button>
          <button className="btn primary" disabled={!file || scanning} onClick={scan}>
            <Sparkles size={17}/> {scanning ? "Analyzing..." : "Scan with AI"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">
          <div><span className="eyebrow">AI extraction</span><h2>Receipt details</h2></div>
        </div>

        {!result ? (
          <div className="empty-state compact">
            <Sparkles size={28}/>
            <p>Upload a receipt and let AI extract the merchant, date, amount and category.</p>
          </div>
        ) : (
          <>
            <div className="ai-result-grid">
              <label>Merchant<input value={result.store || ""} onChange={(e) => setResult({...result, store:e.target.value})}/></label>
              <label>Total<input type="number" value={result.total ?? ""} onChange={(e) => setResult({...result, total:e.target.value})}/></label>
              <label>Date<input type="date" value={result.date || ""} onChange={(e) => setResult({...result, date:e.target.value})}/></label>
              <label>Category<select value={result.category || "other"} onChange={(e) => setResult({...result, category:e.target.value})}>
                <option value="food">Food</option><option value="transport">Transport</option><option value="shopping">Shopping</option><option value="utilities">Utilities</option><option value="other">Other</option>
              </select></label>
            </div>

            {Array.isArray(result.items) && result.items.length > 0 && (
              <div className="items-list">
                <h4>Detected items</h4>
                {result.items.map((item, i) => <div className="item-row" key={i}><span>{item.name}</span><strong>₹{Number(item.price || 0).toFixed(2)}</strong></div>)}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn secondary" onClick={reset}><RotateCcw size={16}/> Rescan</button>
              <button className="btn primary" onClick={save} disabled={saving}><Check size={16}/> {saving ? "Saving..." : "Save expense"}</button>
            </div>
          </>
        )}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
