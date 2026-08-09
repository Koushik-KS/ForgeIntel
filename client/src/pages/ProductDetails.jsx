import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import { products } from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  // Get the latest locally generated product
  const generatedProduct = JSON.parse(
    localStorage.getItem("forgeintel_generated_product") || "null"
  );

  // Get existing demo product
  const staticProduct = products.find(
    (item) => item.id === Number(id)
  );

  // Decide which product to display
  const product =
    generatedProduct?.id === id
      ? generatedProduct
      : staticProduct;

  // Product not found
  if (!product) {
    return (
      <main className="dashboard">

        <div className="details-header">
          <div>
            <p className="eyebrow">
              PRODUCT INTELLIGENCE
            </p>

            <h1>Product Not Found</h1>

            <p className="page-description">
              The requested product could not be found.
            </p>
          </div>
        </div>

        <Link
          to="/products"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

      </main>
    );
  }

  const verifiedCount = product.attributes.filter(
    (attribute) => attribute.status === "Verified"
  ).length;

  const reviewCount = product.attributes.filter(
    (attribute) => attribute.status === "Needs Review"
  ).length;

  return (
    <main className="dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="details-header">

        <div>

          <Link
            to="/products"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <p className="eyebrow">
            PRODUCT INTELLIGENCE
          </p>

          <h1>
            {product.name}
          </h1>

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

      {/* =====================================================
          PRODUCT SUMMARY
      ===================================================== */}

      <section className="product-summary-grid">

        <div className="content-card summary-main">

          <span className="confidence-label">
            OVERALL CONFIDENCE
          </span>

          <strong className="overall-confidence">
            {product.confidence}%
          </strong>

          <div className="large-confidence-bar">

            <div
              style={{
                width: `${product.confidence}%`,
              }}
            ></div>

          </div>

          <p>
            Confidence calculated from extracted
            attributes, available evidence and
            validation results.
          </p>

        </div>

        <div className="content-card summary-stat">

          <ShieldCheck size={24} />

          <strong>
            {verifiedCount}
          </strong>

          <span>
            Verified attributes
          </span>

        </div>

        <div className="content-card summary-stat review-stat">

          <Clock3 size={24} />

          <strong>
            {reviewCount}
          </strong>

          <span>
            Attributes needing review
          </span>

        </div>

      </section>

      {/* =====================================================
          PRODUCT OVERVIEW
      ===================================================== */}

      <section className="content-card description-card">

        <div className="section-header">

          <div>

            <h2>
              Product Overview
            </h2>

            <p>
              Information provided or generated
              for this product.
            </p>

          </div>

        </div>

        <div className="description-content">

          <div>
            <span>PRODUCT</span>

            <strong>
              {product.name}
            </strong>
          </div>

          <div>
            <span>BRAND</span>

            <strong>
              {product.brand}
            </strong>
          </div>

          <div>
            <span>CATEGORY</span>

            <strong>
              {product.category}
            </strong>
          </div>

          <div>
            <span>SKU / PART NUMBER</span>

            <strong>
              {product.sku}
            </strong>
          </div>

          <div className="description-full">

            <span>
              DESCRIPTION
            </span>

            <p>
              {product.description}
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          EXTRACTED PRODUCT INTELLIGENCE
      ===================================================== */}

      <section className="content-card intelligence-card">

        <div className="section-header">

          <div>

            <h2>
              Extracted Product Intelligence
            </h2>

            <p>
              Every attribute includes confidence,
              validation status and traceable evidence.
            </p>

          </div>

          <span className="attribute-count">
            {product.attributes.length} attributes
          </span>

        </div>

        <div className="attributes-list">

          {product.attributes.map((attribute) => (

            <div
              className="attribute-row"
              key={attribute.name}
            >

              {/* ATTRIBUTE */}

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

                <div className="source">
  Source: {attribute.source}
</div>

<div className="evidence-type">
  Evidence Type: {attribute.evidenceType}
</div>

              </div>

              {/* CONFIDENCE */}

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

              {/* STATUS */}

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

      {/* =====================================================
          EVIDENCE & TRACEABILITY
      ===================================================== */}

      <section className="content-card evidence-card">

        <div className="section-header">

          <div>

            <h2>
              Evidence & Traceability
            </h2>

            <p>
              ForgeIntel links generated attributes
              back to their supporting sources.
            </p>

          </div>

        </div>

        <div className="evidence-highlight">

          <FileText size={24} />

          <div>

            <strong>
              Source-backed product intelligence
            </strong>

            <p>
              Each generated attribute stores its
              evidence source so users can verify
              where the information came from.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          HUMAN REVIEW
      ===================================================== */}

      {reviewCount > 0 && (

        <section className="content-card review-card">

          <div className="section-header">

            <div>

              <h2>
                Human Review Required
              </h2>

              <p>
                Some attributes have lower confidence
                and should be reviewed before publishing.
              </p>

            </div>

            <div className="status review">

              <AlertTriangle size={15} />

              {reviewCount} to review

            </div>

          </div>

          <div className="review-actions">

            <button
              type="button"
              className="review-accept"
            >
              <CheckCircle2 size={17} />
              Accept
            </button>

            <button
              type="button"
              className="review-edit"
            >
              Edit Attribute
            </button>

            <button
              type="button"
              className="review-reject"
            >
              <AlertTriangle size={17} />
              Reject
            </button>

          </div>

        </section>

      )}

    </main>
  );
}

export default ProductDetails;