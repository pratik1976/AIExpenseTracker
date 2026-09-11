const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [summary, categories, monthly, recent] = await Promise.all([
      pool.query(
        `SELECT
           COALESCE(SUM(amount),0) AS total_spending,
           COALESCE(SUM(amount) FILTER (
             WHERE expense_date >= DATE_TRUNC('month', CURRENT_DATE)
             AND expense_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
           ),0) AS current_month_spending,
           COALESCE(AVG(amount),0) AS average_receipt,
           COUNT(*)::int AS transaction_count
         FROM expenses
         WHERE user_id=$1`,
        [userId]
      ),
      pool.query(
        `SELECT category, COALESCE(SUM(amount),0) AS total
         FROM expenses
         WHERE user_id=$1
         GROUP BY category
         ORDER BY total DESC`,
        [userId]
      ),
      pool.query(
        `SELECT TO_CHAR(DATE_TRUNC('month', expense_date), 'Mon YYYY') AS month,
                DATE_TRUNC('month', expense_date) AS month_date,
                COALESCE(SUM(amount),0) AS total
         FROM expenses
         WHERE user_id=$1
           AND expense_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
         GROUP BY DATE_TRUNC('month', expense_date)
         ORDER BY month_date ASC`,
        [userId]
      ),
      pool.query(
        `SELECT id, store, amount, category, expense_date, created_at
         FROM expenses
         WHERE user_id=$1
         ORDER BY expense_date DESC, created_at DESC
         LIMIT 5`,
        [userId]
      ),
    ]);

    res.json({
      summary: summary.rows[0],
      categories: categories.rows,
      monthly: monthly.rows,
      recent: recent.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT store, amount, category, expense_date
       FROM expenses
       WHERE user_id=$1
       ORDER BY expense_date DESC
       LIMIT 100`,
      [req.user.userId]
    );

    res.json({ expenses: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
