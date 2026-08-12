import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Filter,
  Package,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Plus,
} from "lucide-react";

import { products } from "../data/products";

function Products() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  // =====================================================
  // GET GENERATED PRODUCTS FROM LOCAL STORAGE
  // =====================================================

  const savedProducts = JSON.parse(
    localStorage.getItem("forgeintel_products") || "[]"
  );

  // =====================================================
  // COMBINE GENERATED + STATIC PRODUCTS
  // REMOVE DUPLICATES
  // =====================================================

  const allProducts = useMemo(() => {
    const productMap = new Map();

    // Static demo products
    products.forEach((product) => {
      productMap.set(String(product.id), product);
    });

    // Generated products
    // Generated products override same ID
    savedProducts.forEach((product) => {
      productMap.set(String(product.id), product);
    });

    return Array.from(productMap.values()).reverse();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    ...new Set(
      allProducts
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return allProducts.filter((product) => {
      const matchesSearch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.sku
          ?.toLowerCase()
          .includes(searchText) ||
        product.brand
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        status === "All" ||
        product.status === status;

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    allProducts,
    search,
    status,
    category,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="dashboard">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            CATALOG
          </p>

          <h1>
            Products
          </h1>

          <p className="page-description">
            Browse and monitor your product intelligence
            catalog.
          </p>

        </div>

        <Link
          to="/add-product"
          className="primary-button"
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      {/* =================================================
          PRODUCT CATALOG
      ================================================= */}

      <section className="content-card products-card">

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <div className="catalog-toolbar">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search product, SKU or brand..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <div className="filter-group">

            <Filter size={17} />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Verified">
                Verified
              </option>

              <option value="Needs Review">
                Needs Review
              </option>

            </select>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >

              {categories.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>

              ))}

            </select>

          </div>

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="catalog-summary">

          <div>

            <strong>
              {filteredProducts.length}
            </strong>

            <span>
              {" "}products found
            </span>

          </div>

          <span className="catalog-info">
            Showing structured product intelligence
          </span>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="product-table">

          <div className="table-header products-header">

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

            <span></span>

          </div>

          {filteredProducts.length > 0 ? (

            filteredProducts.map((product) => (

              <div
                className="table-row products-row"
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
                      {" · "}
                      {product.brand || "No Brand"}
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

                {/* VIEW */}

                <Link
                  to={`/products/${product.id}`}
                  className="view-product"
                >

                  View

                  <ChevronRight size={16} />

                </Link>

              </div>

            ))

          ) : (

            <div className="empty-products">

              <Package size={34} />

              <strong>
                No products found
              </strong>

              <span>
                Try changing your search or filters.
              </span>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Products;