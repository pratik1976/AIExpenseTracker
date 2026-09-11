import React from "react";
import { useNavigate } from "react-router-dom";
import ReceiptUploader from "../components/ReceiptUploader";
import { ArrowLeft } from "lucide-react";

export default function Scan() {
  const navigate = useNavigate();
  return <div className="page">
    <header className="page-header">
      <div><span className="eyebrow">AI receipt scanner</span><h1>Scan a receipt</h1><p>Upload a receipt and review the AI-extracted details before saving.</p></div>
      <button className="btn secondary" onClick={() => navigate("/history")}><ArrowLeft size={16}/> History</button>
    </header>
    <ReceiptUploader onSaved={() => navigate("/history")} />
  </div>;
}
