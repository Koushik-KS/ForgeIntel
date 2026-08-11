import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      default: "",
      trim: true,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Verified", "Needs Review"],
      default: "Needs Review",
    },

    evidence: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      default: "",
    },

    evidenceType: {
      type: String,
      default: "",
    },

    page: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      default: "",
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    imageName: {
      type: String,
      default: null,
    },

    documentName: {
      type: String,
      default: null,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Verified", "Needs Review"],
      default: "Needs Review",
    },

    attributes: {
      type: [attributeSchema],
      default: [],
    },

    verifiedCount: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    documentEvidence: {
      pageCount: {
        type: Number,
        default: 0,
      },

      extracted: {
        type: Boolean,
        default: false,
      },
    },

    pipeline: {
      extraction: {
        type: String,
        default: "Pending",
      },

      normalization: {
        type: String,
        default: "Pending",
      },

      enrichment: {
        type: String,
        default: "Pending",
      },

      evidence: {
        type: String,
        default: "Pending",
      },

      validation: {
        type: String,
        default: "Pending",
      },

      confidence: {
        type: String,
        default: "Pending",
      },
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;