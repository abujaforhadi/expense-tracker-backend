const express = require("express");
const {
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenses
} = require("../controllers/expenseController");

const router = express.Router();

router.get("/", getExpenses);
router.post("/", createExpense);
router.patch("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
