import {
  Package,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import { products as demoProducts } from "../data/products";

function Dashboard() {
  // =====================================================
  // GET SAVED PRODUCTS
  // =====================================================

  const savedProducts = JSON.parse(
    localStorage.getItem("forgeintel_products") || "[]"
  );

  // =====================================================
  // GET DELETED PRODUCT IDS
  // =====================================================

  const deletedProductIds = new Set(
    JSON.parse(
      localStorage.getItem(
        "forgeintel_deleted_products"
      ) || "[]"
    ).map((id) => String(id))
  );

  // =====================================================
  // REMOVE DELETED SAVED PRODUCTS
  // =====================================================

  const activeSavedProducts =
    savedProducts.filter(
      (product) =>
        !deletedProductIds.has(
          String(product.id)
        )
    );

  // =====================================================
  // COMBINE SAVED + DEMO PRODUCTS
  // =====================================================

  const savedProductIds = new Set(
    activeSavedProducts.map((product) =>
      String(product.id)
    )
  );

  const catalogProducts = [
    ...activeSavedProducts,

    ...demoProducts.filter(
      (product) =>
        !savedProductIds.has(
          String(product.id)
        ) &&
        !deletedProductIds.has(
          String(product.id)
        )
    ),
  ];

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProducts =
    catalogProducts.length;

  const verifiedProducts =
    catalogProducts.filter(
      (product) =>
        product.status === "Verified"
    ).length;

  const reviewProducts =
    catalogProducts.filter(
      (product) =>
        product.status === "Needs Review"
    ).length;

  const totalAttributes =
    catalogProducts.reduce(
      (total, product) =>
        total +
        (product.attributes?.length || 0),
      0
    );

  const averageConfidence =
    totalProducts > 0
      ? Math.round(
          catalogProducts.reduce(
            (total, product) =>
              total +
              Number(
                product.confidence || 0
              ),
            0
          ) / totalProducts
        )
      : 0;

  const verifiedPercentage =
    totalProducts > 0
      ? Math.round(
          (verifiedProducts /
            totalProducts) *
            100
        )
      : 0;

  const reviewPercentage =
    totalProducts > 0
      ? Math.round(
          (reviewProducts /
            totalProducts) *
            100
        )
      : 0;

  // =====================================================
  // RECENT PRODUCTS
  // =====================================================

  const recentProducts =
    catalogProducts.slice(0, 5);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="dashboard">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            OVERVIEW
          </p>

          <h1>
            Product Intelligence
          </h1>

          <p className="page-description">
            Monitor product enrichment, validation
            and data quality.
          </p>

        </div>

        <Link
          to="/add-product"
          className="primary-button"
        >
          <ArrowUpRight size={18} />
          Add Product
        </Link>

      </div>


      {/* STATISTICS */}

      <section className="stats-grid">

        {/* TOTAL PRODUCTS */}

        <div className="stat-card">

          <div className="stat-icon blue">
            <Package size={21} />
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              {totalAttributes} attributes analyzed
            </small>

          </div>

        </div>


        {/* VERIFIED PRODUCTS */}

        <div className="stat-card">

          <div className="stat-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>

            <span>
              Verified Products
            </span>

            <strong>
              {verifiedProducts}
            </strong>

            <small>
              {verifiedPercentage}% of catalog
            </small>

          </div>

        </div>


        {/* NEEDS REVIEW */}

        <div className="stat-card">

          <div className="stat-icon orange">
            <AlertTriangle size={21} />
          </div>

          <div>

            <span>
              Needs Review
            </span>

            <strong>
              {reviewProducts}
            </strong>

            <small>
              {reviewPercentage}% of catalog
            </small>

          </div>

        </div>


        {/* AVERAGE CONFIDENCE */}

        <div className="stat-card">

          <div className="stat-icon purple">
            <TrendingUp size={21} />
          </div>

          <div>

            <span>
              Avg. Confidence
            </span>

            <strong>
              {averageConfidence}%
            </strong>

            <small>
              Across product catalog
            </small>

          </div>

        </div>

      </section>


      {/* RECENT PRODUCTS */}

      <section className="content-card">

        <div className="section-header">

          <div>

            <h2>
              Recent Products
            </h2>

            <p>
              Latest products processed by ForgeIntel.
            </p>

          </div>

          <Link
            to="/products"
            className="text-button"
          >
            View all
            <ChevronRight size={16} />
          </Link>

        </div>


        <div className="product-table">

          {/* TABLE HEADER */}

          <div className="table-header">

            <span>
              Product
            </span>

            <span>
              Category
            </span>

            <span>
              Confidence
            </span>

            <span>
              Status
            </span>

          </div>


          {/* PRODUCTS */}

          {recentProducts.length > 0 ? (

            recentProducts.map((product) => (

              <Link
                to={`/products/${product.id}`}
                className="table-row dashboard-product-row"
                key={product.id}
              >

                {/* PRODUCT */}

                <div className="product-name">

                  <div className="product-avatar">
                    {product.name?.charAt(0) || "P"}
                  </div>

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.sku || "No SKU"}
                    </span>

                  </div>

                </div>


                {/* CATEGORY */}

                <span className="category">
                  {product.category || "Uncategorized"}
                </span>


                {/* CONFIDENCE */}

                <div className="confidence">

                  <div className="confidence-bar">

                    <div
                      style={{
                        width: `${
                          product.confidence || 0
                        }%`,
                      }}
                    />

                  </div>

                  <span>
                    {product.confidence || 0}%
                  </span>

                </div>


                {/* STATUS */}

                <span
                  className={`status ${
                    product.status === "Verified"
                      ? "verified"
                      : "review"
                  }`}
                >

                  {product.status === "Verified" ? (

                    <CheckCircle2 size={15} />

                  ) : (

                    <AlertTriangle size={15} />

                  )}

                  {product.status || "Needs Review"}

                </span>

              </Link>

            ))

          ) : (

            <div className="empty-products">

              <Package size={34} />

              <strong>
                No products available
              </strong>

              <span>
                Add a product to start building
                product intelligence.
              </span>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Dashboard;