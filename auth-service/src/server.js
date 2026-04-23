const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB(env.mongoUri);

app.use(cors({ origin: env.corsOrigin === "*" ? true : env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ service: "auth-service", status: "ok" });
});

app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

app.listen(env.port, () => {
  console.log(`Auth service running on port ${env.port}`);
});
