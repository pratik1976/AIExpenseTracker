const { extractReceipt, generateInsights } = require("../services/groqService");
const pool = require("../config/db");

exports.scanReceipt = async (req, res) => {
  try {
    const { image, mimeType } = req.body || {};

    if (!image || !mimeType) {
      return res.status(400).json({ message: "Image and mimeType are required" });
    }

    const rawBase64 = image.includes(",") ? image.split(",")[1] : image;
    if (rawBase64.length > 20 * 1024 * 1024) {
      return res.status(413).json({ message: "Image is too large" });
    }

    const result = await extractReceipt(rawBase64, mimeType);
    res.json(result);
  } catch (error) {
    console.error("Receipt scan error:", error);
    res.status(500).json({ message: error.message || "Receipt scanning failed" });
  }
};

exports.getAiInsights = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT store, amount, category, expense_date
       FROM expenses
       WHERE user_id=$1
       ORDER BY expense_date DESC, created_at DESC
       LIMIT 100`,
      [req.user.userId]
    );

    const insights = await generateInsights(result.rows);
    res.json(insights);
  } catch (error) {
    console.error("AI insight error:", error);
    res.status(500).json({ message: error.message || "AI insights failed" });
  }
};
