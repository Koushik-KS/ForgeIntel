import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDatabase } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import intelligenceRoutes from "./routes/intelligenceRoutes.js";


dotenv.config();


const app = express();

const PORT = process.env.PORT || 5000;


// =====================================================
// DATABASE
// =====================================================

await connectDatabase();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://forge-intel-five.vercel.app",
    ],
    credentials: true,
  })
);


app.use(
  express.json({
    limit: "10mb",
  })
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ForgeIntel API is running",
    service: "ForgeIntel Intelligence Engine",
    status: "operational",
    database: "configured",
  });
});


// =====================================================
// PRODUCT ROUTES
// =====================================================

app.use(
  "/api/products",
  productRoutes
);


// =====================================================
// INTELLIGENCE ROUTES
// =====================================================

app.use(
  "/api/intelligence",
  intelligenceRoutes
);


// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `ForgeIntel server running on port ${PORT}`
  );
});