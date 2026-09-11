const express = require("express");
const protect = require("../middleware/authMiddleware");
const { scanReceipt, getAiInsights } = require("../controllers/aiController");

const router = express.Router();

router.post("/scan-receipt", protect, scanReceipt);
router.get("/insights", protect, getAiInsights);

module.exports = router;
