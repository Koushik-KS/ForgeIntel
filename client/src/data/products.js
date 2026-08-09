export const products = [
  {
    id: 1,
    name: "Industrial Hydraulic Pump",
    sku: "HYD-450",
    category: "Hydraulic Equipment",
    confidence: 94,
    status: "Verified",
    brand: "Hydronex",

    description:
      "Industrial hydraulic pump designed for high-pressure fluid power applications.",

    attributes: [
      {
        name: "Brand",
        value: "Hydronex",
        confidence: 98,
        status: "Verified",
        evidence: "Manufacturer product record",
        source: "Submitted Product Information",
      },
      {
        name: "Category",
        value: "Hydraulic Equipment",
        confidence: 96,
        status: "Verified",
        evidence: "Product classification",
        source: "Industrial Product Taxonomy",
      },
      {
        name: "Operating Pressure",
        value: "250 bar",
        confidence: 94,
        status: "Verified",
        evidence: "Rated operating pressure listed in technical specifications.",
        source: "Manufacturer Technical Catalog — Page 12",
      },
      {
        name: "Flow Rate",
        value: "45 L/min",
        confidence: 82,
        status: "Needs Review",
        evidence: "Flow rate extracted from a technical specification.",
        source: "Technical Datasheet — Page 8",
      },
      {
        name: "Material",
        value: "Cast Iron",
        confidence: 91,
        status: "Verified",
        evidence: "Housing material identified in the manufacturer specification.",
        source: "Manufacturer Technical Catalog — Page 15",
      },
      {
        name: "Application",
        value: "Industrial Hydraulic Systems",
        confidence: 89,
        status: "Verified",
        evidence: "Application identified from product documentation.",
        source: "Product Application Guide",
      },
    ],
  },

  {
    id: 2,
    name: "Deep Groove Ball Bearing",
    sku: "SKF-6205",
    category: "Bearings",
    confidence: 91,
    status: "Verified",
    brand: "SKF",

    description:
      "Deep groove ball bearing designed for industrial rotating equipment.",

    attributes: [
      {
        name: "Brand",
        value: "SKF",
        confidence: 99,
        status: "Verified",
        evidence: "Brand identified from product record.",
        source: "Manufacturer Product Catalog",
      },
      {
        name: "Bearing Type",
        value: "Deep Groove Ball Bearing",
        confidence: 98,
        status: "Verified",
        evidence: "Product type explicitly identified.",
        source: "SKF Technical Catalog — Page 24",
      },
      {
        name: "Bore Diameter",
        value: "25 mm",
        confidence: 97,
        status: "Verified",
        evidence: "Bore diameter listed in dimensional specification.",
        source: "SKF Technical Catalog — Page 25",
      },
      {
        name: "Outer Diameter",
        value: "52 mm",
        confidence: 97,
        status: "Verified",
        evidence: "Outer diameter listed in dimensional specification.",
        source: "SKF Technical Catalog — Page 25",
      },
      {
        name: "Width",
        value: "15 mm",
        confidence: 96,
        status: "Verified",
        evidence: "Bearing width listed in dimensional specification.",
        source: "SKF Technical Catalog — Page 25",
      },
      {
        name: "Seal Type",
        value: "2RS",
        confidence: 88,
        status: "Needs Review",
        evidence: "Seal configuration inferred from the submitted part number.",
        source: "Part Number Interpretation",
      },
    ],
  },

  {
    id: 3,
    name: "Industrial Electric Motor",
    sku: "MTR-220",
    category: "Electric Motors",
    confidence: 86,
    status: "Needs Review",
    brand: "Siemens",

    description:
      "Industrial electric motor for continuous-duty machinery applications.",

    attributes: [
      {
        name: "Brand",
        value: "Siemens",
        confidence: 97,
        status: "Verified",
        evidence: "Manufacturer identified from product information.",
        source: "Manufacturer Product Record",
      },
      {
        name: "Motor Type",
        value: "Three-Phase Induction Motor",
        confidence: 93,
        status: "Verified",
        evidence: "Motor type identified from technical documentation.",
        source: "Motor Technical Datasheet — Page 4",
      },
      {
        name: "Power",
        value: "22 kW",
        confidence: 90,
        status: "Verified",
        evidence: "Rated power extracted from specification table.",
        source: "Motor Technical Datasheet — Page 6",
      },
      {
        name: "Voltage",
        value: "400 V",
        confidence: 79,
        status: "Needs Review",
        evidence: "Voltage identified from a technical document.",
        source: "Electrical Specification — Page 7",
      },
      {
        name: "Efficiency",
        value: "92.4%",
        confidence: 74,
        status: "Needs Review",
        evidence: "Efficiency value requires confirmation against the latest datasheet.",
        source: "Archived Technical Datasheet — Page 9",
      },
    ],
  },

  {
    id: 4,
    name: "Pneumatic Control Valve",
    sku: "PCV-110",
    category: "Valves",
    confidence: 78,
    status: "Needs Review",
    brand: "Festo",

    description:
      "Pneumatic control valve designed for automated industrial fluid control.",

    attributes: [
      {
        name: "Brand",
        value: "Festo",
        confidence: 96,
        status: "Verified",
        evidence: "Brand identified from manufacturer information.",
        source: "Festo Product Catalog",
      },
      {
        name: "Valve Type",
        value: "Pneumatic Control Valve",
        confidence: 94,
        status: "Verified",
        evidence: "Valve type identified from product description.",
        source: "Product Catalog — Page 11",
      },
      {
        name: "Operating Pressure",
        value: "10 bar",
        confidence: 81,
        status: "Needs Review",
        evidence: "Pressure specification requires confirmation.",
        source: "Technical Datasheet — Page 6",
      },
      {
        name: "Port Size",
        value: "1/4 inch",
        confidence: 76,
        status: "Needs Review",
        evidence: "Port size extracted from an older specification.",
        source: "Archived Datasheet — Page 3",
      },
    ],
  },

  {
    id: 5,
    name: "Conveyor Gearbox",
    sku: "GBX-500",
    category: "Gearboxes",
    confidence: 89,
    status: "Verified",
    brand: "SEW",

    description:
      "Industrial gearbox designed for conveyor and material handling systems.",

    attributes: [
      {
        name: "Brand",
        value: "SEW",
        confidence: 98,
        status: "Verified",
        evidence: "Manufacturer identified from product record.",
        source: "SEW Product Catalog",
      },
      {
        name: "Gearbox Type",
        value: "Helical Gearbox",
        confidence: 95,
        status: "Verified",
        evidence: "Gearbox type identified from technical documentation.",
        source: "SEW Technical Catalog — Page 18",
      },
      {
        name: "Gear Ratio",
        value: "20:1",
        confidence: 92,
        status: "Verified",
        evidence: "Gear ratio listed in product specification.",
        source: "Technical Datasheet — Page 10",
      },
      {
        name: "Application",
        value: "Conveyor Systems",
        confidence: 90,
        status: "Verified",
        evidence: "Application identified from product documentation.",
        source: "Application Guide — Page 7",
      },
    ],
  },
];