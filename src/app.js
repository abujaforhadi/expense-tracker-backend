require("dotenv").config();
const express = require("express");
const cors = require("cors");

const expenseRoutes = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/expenses", expenseRoutes);

// Root
app.get("/", (_req, res) => res.send("Welcome to the Expense Tracker API!"));

module.exports = app;
