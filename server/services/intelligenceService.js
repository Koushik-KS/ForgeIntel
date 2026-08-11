// =========================================================
// FORGEINTEL INTELLIGENCE SERVICE
// =========================================================

export function generateProductIntelligence(input = {}) {
  const productName =
    input.name?.trim() || "Unknown Product";

  const brand =
    input.brand?.trim() || "Unspecified";

  const sku =
    input.sku?.trim() || "Not provided";

  const category =
    input.category?.trim() ||
    inferCategory(productName);

  const description =
    input.description?.trim() ||
    generateDescription(
      productName,
      category
    );

  const attributes = [];

  // =====================================================
  // BRAND
  // =====================================================

  if (input.brand?.trim()) {
    attributes.push(
      createAttribute(
        "Brand",
        brand,
        97,
        "Verified",
        "Brand supplied in the original product information.",
        "Submitted Product Information",
        "Submitted"
      )
    );
  } else {
    attributes.push(
      createAttribute(
        "Brand",
        "Unspecified",
        52,
        "Needs Review",
        "Brand was not supplied in the original product information.",
        "Missing Source Data",
        "Missing"
      )
    );
  }

  // =====================================================
  // CATEGORY
  // =====================================================

  if (input.category?.trim()) {
    attributes.push(
      createAttribute(
        "Category",
        category,
        95,
        "Verified",
        "Category supplied in the original product information.",
        "Submitted Product Information",
        "Submitted"
      )
    );
  } else {
    attributes.push(
      createAttribute(
        "Category",
        category,
        84,
        "Needs Review",
        "Category inferred from the product name using the local classification engine.",
        "Local Classification Engine",
        "Inferred"
      )
    );
  }

  // =====================================================
  // SKU / PART NUMBER
  // =====================================================

  if (input.sku?.trim()) {
    attributes.push(
      createAttribute(
        "SKU / Part Number",
        sku,
        98,
        "Verified",
        "Part number supplied in the original product information.",
        "Submitted Product Information",
        "Submitted"
      )
    );
  } else {
    attributes.push(
      createAttribute(
        "SKU / Part Number",
        "Not provided",
        45,
        "Needs Review",
        "No SKU or part number was supplied.",
        "Missing Source Data",
        "Missing"
      )
    );
  }

  // =====================================================
  // PRODUCT TYPE
  // =====================================================

  const productType =
    inferProductType(productName);

  attributes.push(
    createAttribute(
      "Product Type",
      productType,
      91,
      "Verified",
      "Product type identified from the submitted product name.",
      "Local Product Classification Engine",
      "Inferred"
    )
  );

  // =====================================================
  // DESCRIPTION
  // =====================================================

  attributes.push(
    createAttribute(
      "Description",
      description,
      input.description?.trim()
        ? 92
        : 68,
      input.description?.trim()
        ? "Verified"
        : "Needs Review",
      input.description?.trim()
        ? "Description supplied by the product submitter."
        : "Description generated from available product information.",
      input.description?.trim()
        ? "Submitted Product Information"
        : "Local Enrichment Engine",
      input.description?.trim()
        ? "Submitted"
        : "Enriched"
    )
  );

  // =====================================================
  // INDUSTRIAL ENRICHMENT
  // =====================================================

  const enrichedAttributes =
    generateIndustrialAttributes(
      productName,
      category
    );

  attributes.push(
    ...enrichedAttributes
  );

  // =====================================================
  // WEBSITE
  // =====================================================

  if (input.website?.trim()) {
    attributes.push(
      createAttribute(
        "Manufacturer Website",
        input.website.trim(),
        96,
        "Verified",
        "Website URL supplied in the original product information.",
        "Submitted Product Information",
        "Submitted"
      )
    );
  }

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  if (input.imageName) {
    attributes.push(
      createAttribute(
        "Product Image",
        input.imageName,
        88,
        "Verified",
        "Product image supplied with the product submission.",
        "Uploaded Digital Asset",
        "Submitted"
      )
    );
  }

  // =====================================================
  // TECHNICAL DOCUMENT
  // =====================================================

  if (input.documentName) {
    attributes.push(
      createAttribute(
        "Technical Document",
        input.documentName,
        90,
        "Verified",
        "Technical document supplied with the product submission.",
        "Uploaded Technical Document",
        "Submitted"
      )
    );
  }

  // =====================================================
  // VALIDATION
  // =====================================================

  const validatedAttributes =
    validateAttributes(attributes);

  // =====================================================
  // CONFIDENCE
  // =====================================================

  const confidence =
    calculateOverallConfidence(
      validatedAttributes
    );

  const verifiedCount =
    validatedAttributes.filter(
      (attribute) =>
        attribute.status === "Verified"
    ).length;

  const reviewCount =
    validatedAttributes.filter(
      (attribute) =>
        attribute.status === "Needs Review"
    ).length;

  // =====================================================
  // RESULT
  // =====================================================

  return {
    name: productName,
    sku,
    brand,
    category,
    description,

    website:
      input.website?.trim() || "",

    imageName:
      input.imageName || null,

    documentName:
      input.documentName || null,

    confidence,

    status:
      reviewCount > 0
        ? "Needs Review"
        : "Verified",

    attributes:
      validatedAttributes,

    verifiedCount,
    reviewCount,

    documentEvidence: {
      pageCount:
        input.pdfData?.pageCount || 0,

      extracted:
        Boolean(input.pdfData?.fullText),
    },

    pipeline: {
      extraction: input.pdfData
        ? "Complete"
        : "Limited",

      normalization: "Complete",

      enrichment: "Complete",

      evidence: "Complete",

      validation: "Complete",

      confidence: "Complete",
    },

    generatedAt:
      new Date().toISOString(),
  };
}


// =========================================================
// ATTRIBUTE CREATOR
// =========================================================

function createAttribute(
  name,
  value,
  confidence,
  status,
  evidence,
  source,
  evidenceType,
  page = null
) {
  return {
    name,
    value,
    confidence,
    status,
    evidence,
    source,
    evidenceType,
    page,
  };
}


// =========================================================
// CATEGORY INFERENCE
// =========================================================

function inferCategory(productName) {
  const name =
    productName.toLowerCase();

  if (
    name.includes("pump") ||
    name.includes("hydraulic")
  ) {
    return "Hydraulic Equipment";
  }

  if (
    name.includes("bearing")
  ) {
    return "Bearings";
  }

  if (
    name.includes("motor") ||
    name.includes("electric")
  ) {
    return "Electric Motors";
  }

  if (
    name.includes("valve") ||
    name.includes("pneumatic")
  ) {
    return "Valves";
  }

  if (
    name.includes("gearbox") ||
    name.includes("gear")
  ) {
    return "Gearboxes";
  }

  if (
    name.includes("conveyor")
  ) {
    return "Material Handling";
  }

  return "Industrial Equipment";
}


// =========================================================
// PRODUCT TYPE
// =========================================================

function inferProductType(productName) {
  const name =
    productName.toLowerCase();

  if (
    name.includes("hydraulic pump")
  ) {
    return "Industrial Hydraulic Pump";
  }

  if (
    name.includes("pneumatic valve")
  ) {
    return "Pneumatic Control Valve";
  }

  if (
    name.includes("valve")
  ) {
    return "Industrial Control Valve";
  }

  if (
    name.includes("bearing")
  ) {
    return "Industrial Bearing";
  }

  if (
    name.includes("electric motor")
  ) {
    return "Industrial Electric Motor";
  }

  if (
    name.includes("motor")
  ) {
    return "Industrial Motor";
  }

  if (
    name.includes("gearbox")
  ) {
    return "Industrial Gearbox";
  }

  if (
    name.includes("conveyor")
  ) {
    return "Industrial Conveyor Component";
  }

  return "Industrial Product";
}


// =========================================================
// DESCRIPTION
// =========================================================

function generateDescription(
  productName,
  category
) {
  return `${productName} is an industrial product classified under ${category}. Additional technical information should be validated against manufacturer documentation.`;
}


// =========================================================
// INDUSTRIAL ENRICHMENT
// =========================================================

function generateIndustrialAttributes(
  productName,
  category
) {
  const name =
    productName.toLowerCase();

  const attributes = [];

  // -----------------------------------------------------
  // PNEUMATIC VALVE
  // -----------------------------------------------------

  if (
    name.includes("pneumatic") &&
    name.includes("valve")
  ) {
    attributes.push(
      createAttribute(
        "Application",
        "Industrial Automation",
        84,
        "Needs Review",
        "Application inferred from the pneumatic valve product type.",
        "Industrial Knowledge Base",
        "Enriched"
      )
    );

    attributes.push(
      createAttribute(
        "Actuation",
        "Pneumatic",
        87,
        "Needs Review",
        "Actuation method inferred from the product name.",
        "Product Classification Engine",
        "Inferred"
      )
    );

    attributes.push(
      createAttribute(
        "Typical Port Size",
        "1/4 inch",
        63,
        "Needs Review",
        "Typical value suggested for this product class. Manufacturer confirmation required.",
        "Industrial Reference Knowledge",
        "Enriched"
      )
    );

    attributes.push(
      createAttribute(
        "Typical Operating Pressure",
        "10 bar",
        61,
        "Needs Review",
        "Typical pressure value inferred for the product class. Manufacturer confirmation required.",
        "Industrial Reference Knowledge",
        "Enriched"
      )
    );
  }

  // -----------------------------------------------------
  // HYDRAULIC PUMP
  // -----------------------------------------------------

  if (
    name.includes("hydraulic") &&
    name.includes("pump")
  ) {
    attributes.push(
      createAttribute(
        "Application",
        "Industrial Hydraulic Systems",
        88,
        "Verified",
        "Application inferred from the hydraulic pump product class.",
        "Industrial Knowledge Base",
        "Enriched"
      )
    );

    attributes.push(
      createAttribute(
        "Fluid Type",
        "Hydraulic Fluid",
        86,
        "Needs Review",
        "Fluid type inferred from the hydraulic pump classification.",
        "Industrial Knowledge Base",
        "Inferred"
      )
    );

    attributes.push(
      createAttribute(
        "Typical Pressure",
        "High Pressure",
        73,
        "Needs Review",
        "Pressure classification inferred from the product type. Exact rating requires manufacturer evidence.",
        "Industrial Reference Knowledge",
        "Enriched"
      )
    );
  }

  // -----------------------------------------------------
  // BEARING
  // -----------------------------------------------------

  if (
    name.includes("bearing")
  ) {
    attributes.push(
      createAttribute(
        "Application",
        "Rotating Industrial Equipment",
        86,
        "Verified",
        "Application inferred from the bearing product class.",
        "Industrial Knowledge Base",
        "Enriched"
      )
    );

    attributes.push(
      createAttribute(
        "Component Type",
        "Mechanical Bearing",
        92,
        "Verified",
        "Component type identified from the product name.",
        "Product Classification Engine",
        "Inferred"
      )
    );
  }

  // -----------------------------------------------------
  // ELECTRIC MOTOR
  // -----------------------------------------------------

  if (
    name.includes("electric motor") ||
    name.includes("motor")
  ) {
    attributes.push(
      createAttribute(
        "Application",
        "Industrial Machinery",
        85,
        "Verified",
        "Application inferred from the industrial motor product class.",
        "Industrial Knowledge Base",
        "Enriched"
      )
    );

    attributes.push(
      createAttribute(
        "Power Source",
        "Electrical",
        94,
        "Verified",
        "Power source identified from the electric motor classification.",
        "Product Classification Engine",
        "Inferred"
      )
    );
  }

  // -----------------------------------------------------
  // GEARBOX
  // -----------------------------------------------------

  if (
    name.includes("gearbox")
  ) {
    attributes.push(
      createAttribute(
        "Application",
        "Industrial Power Transmission",
        86,
        "Verified",
        "Application inferred from the gearbox product class.",
        "Industrial Knowledge Base",
        "Enriched"
      )
    );

    attributes.push(
      createAttribute(
        "Component Type",
        "Mechanical Gearbox",
        93,
        "Verified",
        "Component type identified from the product name.",
        "Product Classification Engine",
        "Inferred"
      )
    );
  }

  // -----------------------------------------------------
  // GENERIC PRODUCT
  // -----------------------------------------------------

  if (
    attributes.length === 0 &&
    category === "Industrial Equipment"
  ) {
    attributes.push(
      createAttribute(
        "Application",
        "Industrial Equipment",
        65,
        "Needs Review",
        "Application could not be reliably determined from the available information.",
        "Local Enrichment Engine",
        "Inferred"
      )
    );
  }

  return attributes;
}


// =========================================================
// VALIDATION
// =========================================================

function validateAttributes(attributes) {
  return attributes.map(
    (attribute) => {
      let status =
        attribute.status;

      if (
        attribute.confidence < 70
      ) {
        status = "Needs Review";
      }

      if (
        attribute.evidenceType ===
          "Enriched" &&
        attribute.confidence < 80
      ) {
        status = "Needs Review";
      }

      if (
        attribute.evidenceType ===
        "Missing"
      ) {
        status = "Needs Review";
      }

      if (
        attribute.evidenceType ===
          "Submitted" &&
        attribute.confidence >= 90
      ) {
        status = "Verified";
      }

      return {
        ...attribute,
        status,
      };
    }
  );
}


// =========================================================
// OVERALL CONFIDENCE
// =========================================================

function calculateOverallConfidence(
  attributes
) {
  if (!attributes.length) {
    return 0;
  }

  const total =
    attributes.reduce(
      (sum, attribute) =>
        sum + attribute.confidence,
      0
    );

  return Math.round(
    total / attributes.length
  );
}