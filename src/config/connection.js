const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_URI;
if (!uri) throw new Error("MONGO_URI is missing in environment");

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let db;
async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(process.env.DB_NAME || "ExpenseTracker");
  const expenses = db.collection("expenses");
  await expenses.createIndex({ date: -1 });
  await expenses.createIndex({ category: 1 });
  return db;
}
function getDB() {
  if (!db) throw new Error("DB not initialized. Call connectDB() first.");
  return db;
}
module.exports = { connectDB, getDB };
