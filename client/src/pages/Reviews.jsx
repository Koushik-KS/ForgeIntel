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
  const [selectedProductId, setSelectedProductId] =
    useState("");
  const [refresh, setRefresh] = useState(0);

  // =====================================================
  // GET ALL GENERATED PRODUCTS
  // =====================================================

  const generatedProducts = useMemo(() => {
    return JSON.parse(
      localStorage.getItem("forgeintel_products") || "[]"
    );
  }, [refresh]);

  // =====================================================
  // SELECT PRODUCT
  // =====================================================

  const selectedProduct = useMemo(() => {
    if (!generatedProducts.length) {
      return null;
    }

    if (selectedProductId) {
      return (
        generatedProducts.find(
          (product) =>
            String(product.id) ===
            String(selectedProductId)
        ) || generatedProducts[0]
      );
    }

    return generatedProducts[0];
  }, [
    generatedProducts,
    selectedProductId,
  ]);

  // =====================================================
  // GET REVIEW ATTRIBUTES
  // =====================================================

  const reviewAttributes = useMemo(() => {
    if (!selectedProduct?.attributes) {
      return [];
    }

    const searchText =
      search.trim().toLowerCase();

    return selectedProduct.attributes.filter(
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
  }, [selectedProduct, search]);

  // =====================================================
  // SAVE UPDATED PRODUCT
  // =====================================================

  const saveUpdatedProduct = (
    updatedProduct
  ) => {
    const updatedProducts =
      generatedProducts.map((product) =>
        String(product.id) ===
        String(updatedProduct.id)
          ? updatedProduct
          : product
      );

    localStorage.setItem(
      "forgeintel_products",
      JSON.stringify(updatedProducts)
    );

    // Keep current generated product updated
    localStorage.setItem(
      "forgeintel_generated_product",
      JSON.stringify(updatedProduct)
    );

    setRefresh(
      (previous) => previous + 1
    );
  };

  // =====================================================
  // BUILD UPDATED PRODUCT
  // =====================================================

  const buildUpdatedProduct = (
    attributes
  ) => {
    if (!selectedProduct) {
      return null;
    }

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
                sum +
                Number(
                  attribute.confidence || 0
                ),
              0
            ) / attributes.length
          )
        : 0;

    return {
      ...selectedProduct,

      attributes,

      verifiedCount,

      reviewCount,

      confidence,

      status:
        reviewCount > 0
          ? "Needs Review"
          : "Verified",
    };
  };

  // =====================================================
  // ACCEPT ATTRIBUTE
  // =====================================================

  const handleAccept = (
    attributeName
  ) => {
    if (!selectedProduct) {
      return;
    }

    const attributes =
      selectedProduct.attributes.map(
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
              Number(attribute.confidence || 0),
              90
            ),

            evidence:
              "Attribute reviewed and accepted by human reviewer.",

            source:
              "Human Review",

            evidenceType:
              "Reviewed",
          };
        }
      );

    const updatedProduct =
      buildUpdatedProduct(attributes);

    saveUpdatedProduct(updatedProduct);
  };

  // =====================================================
  // REJECT ATTRIBUTE
  // =====================================================

  const handleReject = (
    attributeName
  ) => {
    if (!selectedProduct) {
      return;
    }

    const attributes =
      selectedProduct.attributes.map(
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
              Number(attribute.confidence || 0),
              60
            ),

            evidence:
              "Attribute rejected during human review and requires correction.",

            source:
              "Human Review",

            evidenceType:
              "Rejected",
          };
        }
      );

    const updatedProduct =
      buildUpdatedProduct(attributes);

    saveUpdatedProduct(updatedProduct);
  };

  // =====================================================
  // EDIT ATTRIBUTE
  // =====================================================

  const handleEdit = (
    attributeName
  ) => {
    if (!selectedProduct) {
      return;
    }

    const attribute =
      selectedProduct.attributes.find(
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
      selectedProduct.attributes.map(
        (item) => {
          if (
            item.name !== attributeName
          ) {
            return item;
          }

          return {
            ...item,

            value:
              newValue.trim(),

            status:
              "Needs Review",

            confidence:
              85,

            evidence:
              "Attribute value manually edited and requires reviewer approval.",

            source:
              "Human Review",

            evidenceType:
              "Edited",
          };
        }
      );

    const updatedProduct =
      buildUpdatedProduct(attributes);

    saveUpdatedProduct(updatedProduct);
  };

  // =====================================================
  // NO GENERATED PRODUCTS
  // =====================================================

  if (!generatedProducts.length) {
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
            No products available for review
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
            {selectedProduct?.reviewCount || 0}
            {" "}pending
          </span>

        </div>

      </div>


      {/* =================================================
          PRODUCT SELECTOR
      ================================================= */}

      <section className="content-card review-product-card">

        <div className="section-header">

          <div>

            <h2>
              Select Product
            </h2>

            <p>
              Choose a generated product to review.
            </p>

          </div>

        </div>

        <select
          className="review-product-select"
          value={
            selectedProductId ||
            generatedProducts[0]?.id ||
            ""
          }
          onChange={(event) => {
            setSelectedProductId(
              event.target.value
            );

            setSearch("");
          }}
        >

          {generatedProducts.map(
            (product) => (

              <option
                key={product.id}
                value={product.id}
              >
                {product.name}
                {" · "}
                {product.sku || "No SKU"}
              </option>

            )
          )}

        </select>

      </section>


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
              {selectedProduct?.reviewCount || 0}
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
              {selectedProduct?.verifiedCount || 0}
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
              {selectedProduct?.name}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
          SELECTED PRODUCT
      ================================================= */}

      <section className="content-card review-product-card">

        <div className="section-header">

          <div>

            <h2>
              {selectedProduct?.name}
            </h2>

            <p>
              {selectedProduct?.brand || "No Brand"}
              {" · "}
              {selectedProduct?.sku || "No SKU"}
            </p>

          </div>

          <Link
            to={`/products/${selectedProduct?.id}`}
            className="text-button"
          >
            View Product
            <ArrowRight size={15} />
          </Link>

        </div>

      </section>


      {/* =================================================
          SEARCH + REVIEW LIST
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


        {/* REVIEW ATTRIBUTES */}

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

                      <AlertTriangle size={17} />

                      <span>
                        {attribute.name}
                      </span>

                    </div>

                    <strong>
                      {attribute.value}
                    </strong>


                    {/* EVIDENCE */}

                    <div className="review-evidence">

                      <FileText size={14} />

                      <span>
                        {attribute.evidence ||
                          "No evidence available"}
                      </span>

                    </div>


                    {/* SOURCE */}

                    <div className="review-source">

                      Source:{" "}

                      {attribute.source ||
                        "Unknown"}

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
                          width: `${
                            attribute.confidence || 0
                          }%`,
                        }}
                      />

                    </div>

                    <strong>
                      {attribute.confidence || 0}%
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
                      <CheckCircle2 size={15} />
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
                      <AlertTriangle size={15} />
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

              <CheckCircle2 size={30} />

            </div>

            <h2>
              All attributes reviewed
            </h2>

            <p>
              There are no attributes currently
              waiting for human validation for this
              product.
            </p>

            <Link
              to={`/products/${selectedProduct?.id}`}
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