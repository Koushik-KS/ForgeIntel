import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Package,
  Search,
  ArrowRight,
} from "lucide-react";

function Reviews() {
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(0);

  // =====================================================
  // GET GENERATED PRODUCT
  // =====================================================

  const generatedProduct = useMemo(() => {
    return JSON.parse(
      localStorage.getItem(
        "forgeintel_generated_product"
      ) || "null"
    );
  }, [refresh]);

  // =====================================================
  // GET REVIEW ATTRIBUTES
  // =====================================================

  const reviewAttributes = useMemo(() => {
    if (!generatedProduct?.attributes) {
      return [];
    }

    const searchText =
      search.trim().toLowerCase();

    return generatedProduct.attributes.filter(
      (attribute) => {
        if (
          attribute.status !== "Needs Review"
        ) {
          return false;
        }

        if (!searchText) {
          return true;
        }

        return (
          attribute.name
            ?.toLowerCase()
            .includes(searchText) ||
          attribute.value
            ?.toString()
            .toLowerCase()
            .includes(searchText)
        );
      }
    );
  }, [generatedProduct, search]);

  // =====================================================
  // ACCEPT
  // =====================================================

  const handleAccept = (attributeName) => {
    if (!generatedProduct) {
      return;
    }

    const attributes =
      generatedProduct.attributes.map(
        (attribute) => {
          if (
            attribute.name !== attributeName
          ) {
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
        }
      );

    saveUpdatedProduct(
      attributes
    );
  };

  // =====================================================
  // REJECT
  // =====================================================

  const handleReject = (attributeName) => {
    if (!generatedProduct) {
      return;
    }

    const attributes =
      generatedProduct.attributes.map(
        (attribute) => {
          if (
            attribute.name !== attributeName
          ) {
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
        }
      );

    saveUpdatedProduct(
      attributes
    );
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (attributeName) => {
    if (!generatedProduct) {
      return;
    }

    const attribute =
      generatedProduct.attributes.find(
        (item) =>
          item.name === attributeName
      );

    if (!attribute) {
      return;
    }

    const newValue = window.prompt(
      `Edit value for "${attribute.name}"`,
      attribute.value
    );

    if (
      newValue === null ||
      !newValue.trim()
    ) {
      return;
    }

    const attributes =
      generatedProduct.attributes.map(
        (item) => {
          if (
            item.name !== attributeName
          ) {
            return item;
          }

          return {
            ...item,
            value: newValue.trim(),
            status: "Needs Review",
            confidence: 85,
            evidence:
              "Attribute value manually edited and requires reviewer approval.",
            source: "Human Review",
            evidenceType: "Edited",
          };
        }
      );

    saveUpdatedProduct(
      attributes
    );
  };

  // =====================================================
  // SAVE
  // =====================================================

  const saveUpdatedProduct = (
    attributes
  ) => {
    const verifiedCount =
      attributes.filter(
        (attribute) =>
          attribute.status === "Verified"
      ).length;

    const reviewCount =
      attributes.filter(
        (attribute) =>
          attribute.status === "Needs Review"
      ).length;

    const confidence =
      attributes.length > 0
        ? Math.round(
            attributes.reduce(
              (sum, attribute) =>
                sum + attribute.confidence,
              0
            ) / attributes.length
          )
        : 0;

    const updatedProduct = {
      ...generatedProduct,
      attributes,
      verifiedCount,
      reviewCount,
      confidence,
      status:
        reviewCount > 0
          ? "Needs Review"
          : "Verified",
    };

    localStorage.setItem(
      "forgeintel_generated_product",
      JSON.stringify(updatedProduct)
    );

    setRefresh(
      (previous) => previous + 1
    );
  };

  // =====================================================
  // NO GENERATED PRODUCT
  // =====================================================

  if (!generatedProduct) {
    return (
      <main className="dashboard">

        <div className="page-header">

          <div>
            <p className="eyebrow">
              HUMAN REVIEW
            </p>

            <h1>
              Reviews
            </h1>

            <p className="page-description">
              Review and validate product attributes
              before publishing.
            </p>
          </div>

        </div>

        <section className="content-card reviews-empty">

          <div className="empty-icon">
            <Package size={28} />
          </div>

          <h2>
            No product available for review
          </h2>

          <p>
            Generate product intelligence first.
            Attributes requiring validation will
            appear here.
          </p>

          <Link
            to="/add-product"
            className="primary-button"
          >
            Add Product
            <ArrowRight size={17} />
          </Link>

        </section>

      </main>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            HUMAN REVIEW
          </p>

          <h1>
            Reviews
          </h1>

          <p className="page-description">
            Validate uncertain product intelligence
            before it is published.
          </p>

        </div>

        <div className="review-header-status">

          <Clock3 size={17} />

          <span>
            {generatedProduct.reviewCount || 0}
            {" "}
            pending
          </span>

        </div>

      </div>


      {/* =================================================
          REVIEW SUMMARY
      ================================================= */}

      <section className="review-summary-grid">

        <div className="content-card review-summary-card">

          <div className="review-summary-icon orange">
            <Clock3 size={21} />
          </div>

          <div>

            <span>
              Pending Review
            </span>

            <strong>
              {generatedProduct.reviewCount || 0}
            </strong>

          </div>

        </div>


        <div className="content-card review-summary-card">

          <div className="review-summary-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>

            <span>
              Verified Attributes
            </span>

            <strong>
              {generatedProduct.verifiedCount || 0}
            </strong>

          </div>

        </div>


        <div className="content-card review-summary-card">

          <div className="review-summary-icon blue">
            <Package size={21} />
          </div>

          <div>

            <span>
              Product
            </span>

            <strong className="product-summary-name">
              {generatedProduct.name}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
          PRODUCT
      ================================================= */}

      <section className="content-card review-product-card">

        <div className="section-header">

          <div>

            <h2>
              {generatedProduct.name}
            </h2>

            <p>
              {generatedProduct.brand}
              {" · "}
              {generatedProduct.sku}
            </p>

          </div>

          <Link
            to={`/products/${generatedProduct.id}`}
            className="text-button"
          >
            View Product
            <ArrowRight size={15} />
          </Link>

        </div>

      </section>


      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="content-card">

        <div className="review-toolbar">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search attributes..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <span className="review-count-label">
            {reviewAttributes.length}
            {" "}
            {reviewAttributes.length === 1
              ? "attribute"
              : "attributes"}
          </span>

        </div>


        {/* =================================================
            REVIEW LIST
        ================================================= */}

        {reviewAttributes.length > 0 ? (

          <div className="reviews-list">

            {reviewAttributes.map(
              (attribute) => (

                <div
                  className="review-item"
                  key={attribute.name}
                >

                  {/* ATTRIBUTE INFORMATION */}

                  <div className="review-item-info">

                    <div className="review-item-title">

                      <AlertTriangle
                        size={17}
                      />

                      <span>
                        {attribute.name}
                      </span>

                    </div>

                    <strong>
                      {attribute.value}
                    </strong>

                    <div className="review-evidence">

                      <FileText
                        size={14}
                      />

                      <span>
                        {attribute.evidence}
                      </span>

                    </div>

                    <div className="review-source">

                      Source:{" "}
                      {attribute.source}

                      {attribute.page && (
                        <>
                          {" · "}
                          Document Page:{" "}
                          {attribute.page}
                        </>
                      )}

                    </div>

                  </div>


                  {/* CONFIDENCE */}

                  <div className="review-confidence">

                    <div className="review-confidence-bar">

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


                  {/* ACTIONS */}

                  <div className="review-item-actions">

                    <button
                      type="button"
                      className="review-accept"
                      onClick={() =>
                        handleAccept(
                          attribute.name
                        )
                      }
                    >
                      <CheckCircle2
                        size={15}
                      />
                      Accept
                    </button>

                    <button
                      type="button"
                      className="review-edit"
                      onClick={() =>
                        handleEdit(
                          attribute.name
                        )
                      }
                    >
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
                      <AlertTriangle
                        size={15}
                      />
                      Reject
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="reviews-complete">

            <div className="reviews-complete-icon">

              <CheckCircle2
                size={30}
              />

            </div>

            <h2>
              All attributes reviewed
            </h2>

            <p>
              There are no attributes currently
              waiting for human validation.
            </p>

            <Link
              to={`/products/${generatedProduct.id}`}
              className="primary-button"
            >
              View Product
              <ArrowRight size={17} />
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}

export default Reviews;