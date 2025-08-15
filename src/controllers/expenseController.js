const { ObjectId } = require("mongodb");
const { getDB } = require("../config/connection");
const { validateCreate, validateUpdate } = require("../utils/validate");

async function createExpense(req, res) {
  try {
    const { errors, value } = validateCreate(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const doc = {
      title: value.title,
      amount: value.amount,
      category: value.category,
      date: value.date,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const db = getDB();
    const result = await db.collection("expenses").insertOne(doc);
    const created = await db.collection("expenses").findOne({ _id: result.insertedId });
    res.status(201).json(created);
  } catch (e) {
    console.error("createExpense:", e);
    res.status(500).json({ message: "Failed to create expense" });
  }
}

async function getExpenses(req, res) {
  try {
    const { category, from, to } = req.query;
    const query = {};
    if (category) query.category = category;
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const db = getDB();
    const items = await db.collection("expenses").find(query).sort({ date: -1 }).toArray();
    res.json(items);
  } catch (e) {
    console.error("getExpenses:", e);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
}

async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const { errors, value } = validateUpdate(req.body);
    if (errors.length) return res.status(400).json({ errors });
    if (Object.keys(value).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const db = getDB();
    const result = await db.collection("expenses").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...value, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) return res.status(404).json({ message: "Expense not found" });
    res.json(result);
  } catch (e) {
    console.error("updateExpense:", e);
    res.status(500).json({ message: "Failed to update expense" });
  }
}

async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const db = getDB();
    const result = await db.collection("expenses").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Expense not found" });

    res.json({ message: "Expense deleted" });
  } catch (e) {
    console.error("deleteExpense:", e);
    res.status(500).json({ message: "Failed to delete expense" });
  }
}

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};
