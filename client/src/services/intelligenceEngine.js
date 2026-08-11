// =========================================================
// FORGEINTEL INTELLIGENCE ENGINE
// =========================================================

export function generateProductIntelligence(input) {
  const productName =
    input.name?.trim() || "Unknown Product";

  const brand =
    input.brand?.trim() || "Unspecified";

  const sku =
    input.sku?.trim() || "Not provided";

  const pdfData =
    input.pdfData || null;

  // =======================================================
  // PDF DATA
  // =======================================================

  const pdfAttributes = pdfData?.fullText
    ? extractPdfAttributes(pdfData)
    : [];

  // =======================================================
  // BASIC PRODUCT INFORMATION
  // =======================================================

  const pdfProductType =
    findAttribute(
      pdfAttributes,
      "PDF Product Type"
    );

  const pdfModel =
    findAttribute(
      pdfAttributes,
      "PDF Model / Part Number"
    );

  const category =
    input.category?.trim() ||
    inferCategory(
      productName,
      pdfProductType?.value
    );

  const description =
    input.description?.trim() ||
    generateDescription(
      productName,
      category
    );

  const attributes = [];

  // =======================================================
  // BRAND
  // =======================================================

  if (input.brand) {
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

  // =======================================================
  // CATEGORY
  // =======================================================

  if (input.category) {
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
        pdfProductType
          ? "Category inferred from product information and the technical document."
          : "Category inferred from the product name using the local classification engine.",
        pdfProductType
          ? "Technical Document + Classification Engine"
          : "Local Classification Engine",
        pdfProductType
          ? "Inferred"
          : "Inferred"
      )
    );
  }

  // =======================================================
  // SKU / PART NUMBER
  // =======================================================

  if (input.sku) {
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
  } else if (pdfModel) {
    attributes.push(
      createAttribute(
        "SKU / Part Number",
        pdfModel.value,
        98,
        "Verified",
        `Part number extracted directly from the technical document on page ${pdfModel.page}.`,
        "Technical Document",
        "Extracted",
        pdfModel.page
      )
    );
  } else {
    attributes.push(
      createAttribute(
        "SKU / Part Number",
        "Not provided",
        45,
        "Needs Review",
        "No SKU or part number was supplied or extracted.",
        "Missing Source Data",
        "Missing"
      )
    );
  }

  // =======================================================
  // PRODUCT TYPE
  // =======================================================

  if (pdfProductType) {
    attributes.push(pdfProductType);
  } else {
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
  }

  // =======================================================
  // DESCRIPTION
  // =======================================================

  attributes.push(
    createAttribute(
      "Description",
      description,
      input.description ? 92 : 68,
      input.description
        ? "Verified"
        : "Needs Review",
      input.description
        ? "Description supplied by the product submitter."
        : "Description generated from available product information.",
      input.description
        ? "Submitted Product Information"
        : "Local Enrichment Engine",
      input.description
        ? "Submitted"
        : "Enriched"
    )
  );

  // =======================================================
  // PDF DOCUMENT INTELLIGENCE
  // =======================================================

  const pdfNames = new Set(
    pdfAttributes.map(
      (attribute) => attribute.name
    )
  );

  pdfAttributes.forEach((attribute) => {
    if (
      attribute.name !==
      "PDF Product Type" &&
      attribute.name !==
      "PDF Model / Part Number"
    ) {
      attributes.push(attribute);
    }
  });

  // =======================================================
  // INDUSTRIAL ENRICHMENT
  // =======================================================

  const enrichedAttributes =
    generateIndustrialAttributes(
      productName,
      category,
      pdfAttributes
    );

  // Avoid duplicate inferred attributes when
  // the PDF already supplied the same information.

  enrichedAttributes.forEach((attribute) => {
    const pdfEquivalent =
      getPdfEquivalent(attribute.name);

    if (
      !pdfEquivalent ||
      !pdfNames.has(pdfEquivalent)
    ) {
      attributes.push(attribute);
    }
  });

  // =======================================================
  // WEBSITE
  // =======================================================

  if (input.website) {
    attributes.push(
      createAttribute(
        "Manufacturer Website",
        input.website,
        96,
        "Verified",
        "Website URL supplied in the original product information.",
        "Submitted Product Information",
        "Submitted"
      )
    );
  }

  // =======================================================
  // PRODUCT IMAGE
  // =======================================================

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

  // =======================================================
  // TECHNICAL DOCUMENT
  // =======================================================

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

  // =======================================================
  // VALIDATION
  // =======================================================

  const validatedAttributes =
    validateAttributes(attributes);

  // =======================================================
  // CONFIDENCE
  // =======================================================

  const overallConfidence =
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

  // =======================================================
  // FINAL PRODUCT
  // =======================================================

  return {
    id: `generated-${Date.now()}`,

    name: productName,

    sku,

    brand,

    category,

    description,

    website:
      input.website || "",

    imageName:
      input.imageName || null,

    documentName:
      input.documentName || null,

    confidence:
      overallConfidence,

    status:
      reviewCount > 0
        ? "Needs Review"
        : "Verified",

    attributes:
      validatedAttributes,

    verifiedCount,

    reviewCount,

    generatedAt:
      new Date().toISOString(),

    documentEvidence: pdfData
      ? {
          pageCount:
            pdfData.pageCount || 0,

          extracted: true,
        }
      : {
          pageCount: 0,
          extracted: false,
        },

    pipeline: {
      extraction: "Complete",
      normalization: "Complete",
      enrichment: "Complete",
      evidence: "Complete",
      validation: "Complete",
      confidence: "Complete",
    },
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
// FIND ATTRIBUTE
// =========================================================

function findAttribute(
  attributes,
  name
) {
  return attributes.find(
    (attribute) =>
      attribute.name === name
  );
}


// =========================================================
// PDF ATTRIBUTE EXTRACTION
// =========================================================

function extractPdfAttributes(pdfData) {
  const attributes = [];

  const pages =
    pdfData.pages || [];

  // -------------------------------------------------------
  // FIELD EXTRACTION
  // -------------------------------------------------------

  const findPdfValue = (labels) => {
    for (const page of pages) {
      const text =
        (page.text || "")
          .replace(/\s+/g, " ")
          .trim();

      for (const label of labels) {
        const escapedLabel =
          escapeRegex(label);

        // Find the label first.
        const labelRegex =
          new RegExp(
            `${escapedLabel}\\s*[:\\-]?\\s*`,
            "i"
          );

        const labelMatch =
          text.match(labelRegex);

        if (!labelMatch) {
          continue;
        }

        const start =
          labelMatch.index +
          labelMatch[0].length;

        const remaining =
          text.slice(start);

        // Known labels that mark the
        // beginning of the next field.
        const nextFieldRegex =
          /\s+(?=(?:Product Type|Model\s*\/?\s*Part Number|Model|Part Number|Application|Actuation|Port Size|Typical Operating Pressure|Operating Pressure|Working Medium|Medium|Body Material|Material|Operating Temperature|Connection|Mounting|Fluid Type|Power Source)\s*[:\-]?)/i;

        const nextMatch =
          remaining.match(
            nextFieldRegex
          );

        let value;

        if (nextMatch) {
          value =
            remaining
              .slice(0, nextMatch.index)
              .trim();
        } else {
          // Important:
          // If the field is the last field
          // on the page, take the remaining text.
          value =
            remaining.trim();
        }

        if (
          value &&
          value.length < 300
        ) {
          return {
            value: cleanPdfValue(value),
            page: page.page,
          };
        }
      }
    }

    return null;
  };

  // =======================================================
  // PRODUCT TYPE
  // =======================================================

  const productType =
    findPdfValue([
      "Product Type",
    ]);

  if (productType) {
    attributes.push(
      createAttribute(
        "PDF Product Type",
        productType.value,
        98,
        "Verified",
        `Product type extracted directly from the technical document on page ${productType.page}.`,
        "Technical Document",
        "Extracted",
        productType.page
      )
    );
  }

  // =======================================================
  // MODEL / PART NUMBER
  // =======================================================

  const model =
    findPdfValue([
      "Model / Part Number",
      "Model",
      "Part Number",
    ]);

  if (model) {
    attributes.push(
      createAttribute(
        "PDF Model / Part Number",
        model.value,
        98,
        "Verified",
        `Model or part number extracted directly from the technical document on page ${model.page}.`,
        "Technical Document",
        "Extracted",
        model.page
      )
    );
  }

  // =======================================================
  // APPLICATION
  // =======================================================

  const application =
    findPdfValue([
      "Application",
    ]);

  if (application) {
    attributes.push(
      createAttribute(
        "PDF Application",
        application.value,
        97,
        "Verified",
        `Application extracted directly from the technical document on page ${application.page}.`,
        "Technical Document",
        "Extracted",
        application.page
      )
    );
  }

  // =======================================================
  // ACTUATION
  // =======================================================

  const actuation =
    findPdfValue([
      "Actuation",
    ]);

  if (actuation) {
    attributes.push(
      createAttribute(
        "PDF Actuation",
        actuation.value,
        97,
        "Verified",
        `Actuation method extracted directly from the technical document on page ${actuation.page}.`,
        "Technical Document",
        "Extracted",
        actuation.page
      )
    );
  }

  // =======================================================
  // PORT SIZE
  // =======================================================

  const portSize =
    findPdfValue([
      "Port Size",
    ]);

  if (portSize) {
    attributes.push(
      createAttribute(
        "PDF Port Size",
        portSize.value,
        97,
        "Verified",
        `Port size extracted directly from the technical document on page ${portSize.page}.`,
        "Technical Document",
        "Extracted",
        portSize.page
      )
    );
  }

  // =======================================================
  // OPERATING PRESSURE
  // =======================================================

  const pressure =
    findPdfValue([
      "Typical Operating Pressure",
      "Operating Pressure",
    ]);

  if (pressure) {
    attributes.push(
      createAttribute(
        "PDF Operating Pressure",
        pressure.value,
        97,
        "Verified",
        `Operating pressure extracted directly from the technical document on page ${pressure.page}.`,
        "Technical Document",
        "Extracted",
        pressure.page
      )
    );
  }

  // =======================================================
  // WORKING MEDIUM
  // =======================================================

  const medium =
    findPdfValue([
      "Working Medium",
      "Medium",
    ]);

  if (medium) {
    attributes.push(
      createAttribute(
        "PDF Working Medium",
        medium.value,
        96,
        "Verified",
        `Working medium extracted directly from the technical document on page ${medium.page}.`,
        "Technical Document",
        "Extracted",
        medium.page
      )
    );
  }

  // =======================================================
  // BODY MATERIAL
  // =======================================================

  const material =
    findPdfValue([
      "Body Material",
      "Material",
    ]);

  if (material) {
    attributes.push(
      createAttribute(
        "PDF Body Material",
        material.value,
        96,
        "Verified",
        `Body material extracted directly from the technical document on page ${material.page}.`,
        "Technical Document",
        "Extracted",
        material.page
      )
    );
  }

  // =======================================================
  // OPERATING TEMPERATURE
  // =======================================================

  const temperature =
    findPdfValue([
      "Operating Temperature",
    ]);

  if (temperature) {
    attributes.push(
      createAttribute(
        "PDF Operating Temperature",
        temperature.value,
        96,
        "Verified",
        `Operating temperature extracted directly from the technical document on page ${temperature.page}.`,
        "Technical Document",
        "Extracted",
        temperature.page
      )
    );
  }

  // =======================================================
  // CONNECTION
  // =======================================================

  const connection =
    findPdfValue([
      "Connection",
    ]);

  if (connection) {
    attributes.push(
      createAttribute(
        "PDF Connection",
        connection.value,
        95,
        "Verified",
        `Connection type extracted directly from the technical document on page ${connection.page}.`,
        "Technical Document",
        "Extracted",
        connection.page
      )
    );
  }

  // =======================================================
  // MOUNTING
  // =======================================================

  const mounting =
    findPdfValue([
      "Mounting",
    ]);

  if (mounting) {
    attributes.push(
      createAttribute(
        "PDF Mounting",
        mounting.value,
        95,
        "Verified",
        `Mounting information extracted directly from the technical document on page ${mounting.page}.`,
        "Technical Document",
        "Extracted",
        mounting.page
      )
    );
  }

  return attributes;
}


// =========================================================
// CLEAN PDF VALUE
// =========================================================

function cleanPdfValue(value) {
  return value
    .replace(/\s+/g, " ")
    .replace(/^[\s:;\-,]+/, "")
    .replace(/[\s;]+$/, "")
    .trim();
}


// =========================================================
// ESCAPE REGEX
// =========================================================

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}


// =========================================================
// PDF EQUIVALENT
// =========================================================

function getPdfEquivalent(name) {
  const map = {
    Application: "PDF Application",
    Actuation: "PDF Actuation",
    "Typical Port Size": "PDF Port Size",
    "Typical Operating Pressure":
      "PDF Operating Pressure",
    "Fluid Type": "PDF Working Medium",
    "Component Type": "PDF Product Type",
  };

  return map[name] || null;
}


// =========================================================
// CATEGORY INFERENCE
// =========================================================

function inferCategory(
  productName,
  pdfProductType = ""
) {
  const name =
    `${productName} ${pdfProductType}`
      .toLowerCase();

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
// PRODUCT TYPE INFERENCE
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
// INDUSTRIAL ATTRIBUTE ENRICHMENT
// =========================================================

function generateIndustrialAttributes(
  productName,
  category,
  pdfAttributes = []
) {
  const name =
    productName.toLowerCase();

  const attributes = [];

  // =======================================================
  // PNEUMATIC VALVE
  // =======================================================

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
        "Typical pressure range inferred for the product class. This is not a manufacturer-confirmed specification.",
        "Industrial Reference Knowledge",
        "Enriched"
      )
    );
  }

  // =======================================================
  // HYDRAULIC PUMP
  // =======================================================

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

  // =======================================================
  // BEARING
  // =======================================================

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

  // =======================================================
  // ELECTRIC MOTOR
  // =======================================================

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

  // =======================================================
  // GEARBOX
  // =======================================================

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

  // =======================================================
  // GENERIC PRODUCT
  // =======================================================

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
  return attributes.map((attribute) => {
    let confidence =
      attribute.confidence;

    let status =
      attribute.status;

    // Very low confidence
    if (confidence < 70) {
      status = "Needs Review";
    }

    // Enriched values
    if (
      attribute.evidenceType === "Enriched" &&
      confidence < 80
    ) {
      status = "Needs Review";
    }

    // Missing values
    if (
      attribute.evidenceType === "Missing"
    ) {
      status = "Needs Review";
    }

    // Submitted information
    if (
      attribute.evidenceType === "Submitted" &&
      confidence >= 90
    ) {
      status = "Verified";
    }

    // Extracted PDF information
    if (
      attribute.evidenceType === "Extracted" &&
      confidence >= 90
    ) {
      status = "Verified";
    }

    return {
      ...attribute,
      confidence,
      status,
    };
  });
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