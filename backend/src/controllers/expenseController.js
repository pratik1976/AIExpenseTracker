const pool = require("../config/db");

const allowedCategories = ["food", "transport", "shopping", "utilities", "other"];

function validateExpense(body) {
  const { store, amount, category, expense_date } = body || {};
  if (!store || amount === undefined || amount === null || !expense_date) {
    return "Store, amount and date are required";
  }
  if (Number.isNaN(Number(amount)) || Number(amount) < 0) {
    return "Amount must be a valid non-negative number";
  }
  if (!allowedCategories.includes(category)) {
    return "Invalid category";
  }
  return null;
}

exports.createExpense = async (req, res) => {
  try {
    const error = validateExpense(req.body);
    if (error) return res.status(400).json({ message: error });

    const { store, amount, category, expense_date, receipt_url } = req.body;

    const result = await pool.query(
      `INSERT INTO expenses
       (user_id, store, amount, category, expense_date, receipt_url)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.userId, store.trim(), Number(amount), category, expense_date, receipt_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM expenses
       WHERE user_id = $1
       ORDER BY expense_date DESC, created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const error = validateExpense(req.body);
    if (error) return res.status(400).json({ message: error });

    const { id } = req.params;
    const { store, amount, category, expense_date, receipt_url } = req.body;

    const result = await pool.query(
      `UPDATE expenses
       SET store=$1, amount=$2, category=$3, expense_date=$4,
           receipt_url=$5, updated_at=NOW()
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [store.trim(), Number(amount), category, expense_date, receipt_url || null, id, req.user.userId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM expenses
       WHERE id=$1 AND user_id=$2
       RETURNING id`,
      [req.params.id, req.user.userId]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
