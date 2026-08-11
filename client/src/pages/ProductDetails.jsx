import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Clock3,
  Pencil,
  X,
  Save,
} from "lucide-react";

import { products } from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  // =====================================================
  // GET PRODUCT
  // =====================================================

  const getProduct = () => {
    const generatedProduct = JSON.parse(
      localStorage.getItem(
        "forgeintel_generated_product"
      ) || "null"
    );

    const staticProduct = products.find(
      (item) => item.id === Number(id)
    );

    if (
      generatedProduct?.id &&
      String(generatedProduct.id) === String(id)
    ) {
      return generatedProduct;
    }

    return staticProduct;
  };

  const [product, setProduct] = useState(getProduct);

  const [editingAttribute, setEditingAttribute] =
    useState(null);

  const [editValue, setEditValue] = useState("");

  // =====================================================
  // REFRESH PRODUCT
  // =====================================================

  useEffect(() => {
    setProduct(getProduct());
  }, [id]);

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const saveProduct = (updatedProduct) => {
    setProduct(updatedProduct);

    if (
      updatedProduct.id &&
      String(updatedProduct.id) === String(id)
    ) {
      localStorage.setItem(
        "forgeintel_generated_product",
        JSON.stringify(updatedProduct)
      );
    }
  };

  // =====================================================
  // BUILD UPDATED PRODUCT
  // =====================================================

  const buildUpdatedProduct = (updatedAttributes) => {
    const reviewCount =
      updatedAttributes.filter(
        (attribute) =>
          attribute.status === "Needs Review"
      ).length;

    const verifiedCount =
      updatedAttributes.filter(
        (attribute) =>
          attribute.status === "Verified"
      ).length;

    return {
      ...product,
      attributes: updatedAttributes,
      reviewCount,
      verifiedCount,
      status:
        reviewCount > 0
          ? "Needs Review"
          : "Verified",
      confidence:
        calculateConfidence(updatedAttributes),
    };
  };

  // =====================================================
  // ACCEPT ATTRIBUTE
  // =====================================================

  const handleAccept = (attributeName) => {
    const updatedAttributes =
      product.attributes.map((attribute) => {
        if (attribute.name !== attributeName) {
          return attribute;
        }

        return {
          ...attribute,
          status: "Verified",
          confidence: Math.max(
            attribute.confidence,
            90
          ),
          evidence:
            "Attribute reviewed and accepted by human reviewer.",
          source: "Human Review",
          evidenceType: "Reviewed",
        };
      });

    const updatedProduct =
      buildUpdatedProduct(updatedAttributes);

    saveProduct(updatedProduct);
  };

  // =====================================================
  // REJECT ATTRIBUTE
  // =====================================================

  const handleReject = (attributeName) => {
    const updatedAttributes =
      product.attributes.map((attribute) => {
        if (attribute.name !== attributeName) {
          return attribute;
        }

        return {
          ...attribute,
          status: "Needs Review",
          confidence: Math.min(
            attribute.confidence,
            60
          ),
          evidence:
            "Attribute rejected during human review and requires correction.",
          source: "Human Review",
          evidenceType: "Rejected",
        };
      });

    const updatedProduct =
      buildUpdatedProduct(updatedAttributes);

    saveProduct(updatedProduct);
  };

  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute.name);
    setEditValue(attribute.value);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingAttribute(null);
    setEditValue("");
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = (attributeName) => {
    if (!editValue.trim()) {
      return;
    }

    const updatedAttributes =
      product.attributes.map((attribute) => {
        if (attribute.name !== attributeName) {
          return attribute;
        }

        return {
          ...attribute,
          value: editValue.trim(),
          status: "Needs Review",
          confidence: 85,
          evidence:
            "Attribute value manually edited and requires reviewer approval.",
          source: "Human Review",
          evidenceType: "Edited",
        };
      });

    const updatedProduct =
      buildUpdatedProduct(updatedAttributes);

    saveProduct(updatedProduct);

    setEditingAttribute(null);
    setEditValue("");
  };

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <main className="dashboard">

        <div className="details-header">

          <div>

            <p className="eyebrow">
              PRODUCT INTELLIGENCE
            </p>

            <h1>
              Product Not Found
            </h1>

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

  // =====================================================
  // COUNTS
  // =====================================================

  const verifiedCount =
    product.attributes.filter(
      (attribute) =>
        attribute.status === "Verified"
    ).length;

  const reviewCount =
    product.attributes.filter(
      (attribute) =>
        attribute.status === "Needs Review"
    ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

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


      {/* =================================================
          PRODUCT SUMMARY
      ================================================= */}

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
            />

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


      {/* =================================================
          PRODUCT OVERVIEW
      ================================================= */}

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

            <span>
              PRODUCT
            </span>

            <strong>
              {product.name}
            </strong>

          </div>


          <div>

            <span>
              BRAND
            </span>

            <strong>
              {product.brand}
            </strong>

          </div>


          <div>

            <span>
              CATEGORY
            </span>

            <strong>
              {product.category}
            </strong>

          </div>


          <div>

            <span>
              SKU / PART NUMBER
            </span>

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


      {/* =================================================
          EXTRACTED PRODUCT INTELLIGENCE
      ================================================= */}

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

          {product.attributes.map(
            (attribute) => (

              <div
                className="attribute-row"
                key={attribute.name}
              >

                {/* ATTRIBUTE */}

                <div className="attribute-info">

                  <span className="attribute-name">
                    {attribute.name}
                  </span>


                  {editingAttribute ===
                  attribute.name ? (

                    <div className="attribute-editor">

                      <input
                        type="text"
                        value={editValue}
                        onChange={(event) =>
                          setEditValue(
                            event.target.value
                          )
                        }
                        autoFocus
                      />

                      <div className="attribute-editor-actions">

                        <button
                          type="button"
                          className="editor-save"
                          onClick={() =>
                            handleSaveEdit(
                              attribute.name
                            )
                          }
                        >
                          <Save size={15} />
                          Save
                        </button>

                        <button
                          type="button"
                          className="editor-cancel"
                          onClick={
                            handleCancelEdit
                          }
                        >
                          <X size={15} />
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    <strong>
                      {attribute.value}
                    </strong>

                  )}


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
                    Evidence Type:{" "}
                    {attribute.evidenceType}
                  </div>


                  {attribute.page && (
                    <div className="source">
                      Document Page:{" "}
                      {attribute.page}
                    </div>
                  )}

                </div>


                {/* CONFIDENCE */}

                <div className="attribute-confidence">

                  <div className="attribute-bar">

                    <div
                      style={{
                        width: `${attribute.confidence}%`,
                      }}
                    />

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

                  {attribute.status ===
                  "Verified" ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <AlertTriangle size={15} />
                  )}

                  {attribute.status}

                </div>


                {/* REVIEW ACTIONS */}

                {attribute.status ===
                  "Needs Review" && (

                  <div className="attribute-review-actions">

                    <button
                      type="button"
                      className="review-accept"
                      onClick={() =>
                        handleAccept(
                          attribute.name
                        )
                      }
                    >
                      <CheckCircle2 size={15} />
                      Accept
                    </button>


                    <button
                      type="button"
                      className="review-edit"
                      onClick={() =>
                        handleEdit(attribute)
                      }
                    >
                      <Pencil size={15} />
                      Edit
                    </button>


                    <button
                      type="button"
                      className="review-reject"
                      onClick={() =>
                        handleReject(
                          attribute.name
                        )
                      }
                    >
                      <AlertTriangle size={15} />
                      Reject
                    </button>

                  </div>

                )}

              </div>
            )
          )}

        </div>

      </section>


      {/* =================================================
          EVIDENCE & TRACEABILITY
      ================================================= */}

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


      {/* =================================================
          HUMAN REVIEW
      ================================================= */}

      {reviewCount > 0 && (

        <section className="content-card review-card">

          <div className="section-header">

            <div>

              <h2>
                Human Review Required
              </h2>

              <p>
                {reviewCount} attribute
                {reviewCount !== 1
                  ? "s"
                  : ""}{" "}
                still require review.
              </p>

            </div>

            <div className="status review">

              <AlertTriangle size={15} />

              {reviewCount} to review

            </div>

          </div>


          <p className="page-description">
            Review the attributes marked as needing
            review and take the appropriate action
            before publishing.
          </p>

        </section>

      )}

    </main>
  );
}


// =====================================================
// CONFIDENCE CALCULATION
// =====================================================

function calculateConfidence(attributes) {
  if (!attributes.length) {
    return 0;
  }

  const total = attributes.reduce(
    (sum, attribute) =>
      sum + attribute.confidence,
    0
  );

  return Math.round(
    total / attributes.length
  );
}

export default ProductDetails;