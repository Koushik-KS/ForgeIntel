import {
  generateProductIntelligence,
} from "../services/intelligenceService.js";

import Product from "../models/Product.js";

// =====================================================
// GENERATE PRODUCT INTELLIGENCE
// =====================================================

export async function generateIntelligence(req, res) {
  try {
    const input = req.body;

    // ===================================================
    // VALIDATE INPUT
    // ===================================================

    if (!input.name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    // ===================================================
    // GENERATE INTELLIGENCE
    // ===================================================

    const intelligence =
      generateProductIntelligence(input);

    // ===================================================
    // SAVE TO DATABASE
    // ===================================================

    const product = await Product.create(
      intelligence
    );

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(201).json({
      success: true,
      message:
        "Product intelligence generated successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Intelligence generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate product intelligence.",
      error: error.message,
    });
  }
}