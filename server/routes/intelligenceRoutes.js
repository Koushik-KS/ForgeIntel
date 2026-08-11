import express from "express";

import {
  generateIntelligence,
} from "../controllers/intelligenceController.js";

const router = express.Router();

router.post(
  "/generate",
  generateIntelligence
);

export default router;