const app = require("./app");
const { connectDB } = require("./config/connection");

const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
})();
