import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";

import { products } from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="dashboard">
        <h1>Product not found</h1>

        <Link to="/products" className="back-link">
          <ArrowLeft size={17} />
          Back to Products
        </Link>
      </main>
    );
  }

  const attributes = [
    {
      name: "Brand",
      value: product.brand,
      confidence: 98,
      status: "Verified",
      evidence: "Submitted product information",
    },
    {
      name: "Category",
      value: product.category,
      confidence: 96,
      status: "Verified",
      evidence: "Product classification",
    },
    {
      name: "Product Type",
      value: product.name,
      confidence: 94,
      status: "Verified",
      evidence: "Product name and catalog context",
    },
    {
      name: "Material",
      value: "Industrial-grade steel",
      confidence: 91,
      status: "Verified",
      evidence: "Technical product documentation",
    },
    {
      name: "Operating Pressure",
      value: "250 bar",
      confidence: 94,
      status: "Verified",
      evidence: "Manufacturer Technical Catalog — Page 12",
    },
    {
      name: "Flow Rate",
      value: "45 L/min",
      confidence: 82,
      status: "Needs Review",
      evidence: "Technical specification — Page 8",
    },
  ];

  return (
    <main className="dashboard">

      {/* Header */}

      <div className="details-header">

        <div>
          <Link to="/products" className="back-link">
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <p className="eyebrow">PRODUCT INTELLIGENCE</p>

          <h1>{product.name}</h1>

          <p className="page-description">
            {product.brand} · {product.sku}
          </p>
        </div>

        <div
          className={`status ${
            product.status === "Verified"
              ? "verified"
              : "review"
          }`}
        >
          {product.status === "Verified" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}

          {product.status}
        </div>

      </div>

      {/* Confidence */}

      <section className="confidence-card">

        <div>
          <span className="confidence-label">
            OVERALL CONFIDENCE
          </span>

          <strong>{product.confidence}%</strong>

          <p>
            Based on extracted attributes,
            evidence and validation checks.
          </p>
        </div>

        <div className="large-confidence-bar">
          <div
            style={{
              width: `${product.confidence}%`,
            }}
          ></div>
        </div>

      </section>

      {/* Product Intelligence */}

      <section className="content-card intelligence-card">

        <div className="section-header">
          <div>
            <h2>Product Intelligence</h2>

            <p>
              Every attribute includes confidence,
              validation status and evidence.
            </p>
          </div>
        </div>

        <div className="attributes-list">

          {attributes.map((attribute) => (
            <div
              className="attribute-row"
              key={attribute.name}
            >

              <div className="attribute-info">

                <span className="attribute-name">
                  {attribute.name}
                </span>

                <strong>
                  {attribute.value}
                </strong>

                <div className="evidence">
                  <FileText size={14} />

                  <span>
                    {attribute.evidence}
                  </span>
                </div>

              </div>

              <div className="attribute-confidence">

                <div className="attribute-bar">
                  <div
                    style={{
                      width: `${attribute.confidence}%`,
                    }}
                  ></div>
                </div>

                <strong>
                  {attribute.confidence}%
                </strong>

              </div>

              <div
                className={`status ${
                  attribute.status === "Verified"
                    ? "verified"
                    : "review"
                }`}
              >
                {attribute.status === "Verified" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertTriangle size={15} />
                )}

                {attribute.status}
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* Validation */}

      <section className="content-card validation-card">

        <div className="section-header">
          <div>
            <h2>Validation & Evidence</h2>

            <p>
              ForgeIntel keeps evidence attached to
              generated product information.
            </p>
          </div>
        </div>

        <div className="validation-grid">

          <div className="validation-item verified-box">
            <CheckCircle2 size={22} />

            <div>
              <strong>4 Attributes Verified</strong>

              <span>
                Supported by available product evidence.
              </span>
            </div>
          </div>

          <div className="validation-item review-box">
            <AlertTriangle size={22} />

            <div>
              <strong>1 Attribute Needs Review</strong>

              <span>
                Human validation recommended before publishing.
              </span>
            </div>
          </div>

        </div>

      </section>

      {/* Human Review */}

      <section className="content-card review-card">

        <div className="section-header">
          <div>
            <h2>Human Review</h2>

            <p>
              Review uncertain information before
              publishing it to the catalog.
            </p>
          </div>
        </div>

        <div className="review-actions">

          <button className="review-accept">
            <CheckCircle2 size={17} />
            Accept
          </button>

          <button className="review-edit">
            Edit Attribute
          </button>

          <button className="review-reject">
            <AlertTriangle size={17} />
            Reject
          </button>

        </div>

      </section>

    </main>
  );
}

export default ProductDetails;