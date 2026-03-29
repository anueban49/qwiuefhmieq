import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import instrumentsRouter from "./routes/instruments";
import categoriesRouter from "./routes/categories";
import reagentsRouter from "./routes/reagents";
import pillarsRouter from "./routes/pillars";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/instruments", instrumentsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reagents", reagentsRouter);
app.use("/api/pillars", pillarsRouter);

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`TestGene Backend running on http://localhost:${PORT}`);
});
