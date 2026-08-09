import {
  Package,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const products = [
  {
    name: "Industrial Hydraulic Pump",
    sku: "HYD-450",
    category: "Hydraulic Equipment",
    confidence: 94,
    status: "Verified",
  },
  {
    name: "Deep Groove Ball Bearing",
    sku: "SKF-6205",
    category: "Bearings",
    confidence: 91,
    status: "Verified",
  },
  {
    name: "Industrial Electric Motor",
    sku: "MTR-220",
    category: "Electric Motors",
    confidence: 86,
    status: "Needs Review",
  },
  {
    name: "Pneumatic Control Valve",
    sku: "PCV-110",
    category: "Valves",
    confidence: 78,
    status: "Needs Review",
  },
];

function Dashboard() {
  return (
    <main className="dashboard">
      <div className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Product Intelligence</h1>
          <p className="page-description">
            Monitor product enrichment, validation and data quality.
          </p>
        </div>

        <button className="primary-button">
          <ArrowUpRight size={18} />
          Add Product
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={21} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>1,248</strong>
            <small>+12.5% this month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Verified Products</span>
            <strong>1,086</strong>
            <small>87% of catalog</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Needs Review</span>
            <strong>162</strong>
            <small>13% of catalog</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Avg. Confidence</span>
            <strong>91.4%</strong>
            <small>+3.2% this month</small>
          </div>
        </div>
      </section>

      <section className="content-card">
        <div className="section-header">
          <div>
            <h2>Recent Products</h2>
            <p>Latest products processed by ForgeIntel.</p>
          </div>

          <button className="text-button">View all</button>
        </div>

        <div className="product-table">
          <div className="table-header">
            <span>Product</span>
            <span>Category</span>
            <span>Confidence</span>
            <span>Status</span>
          </div>

          {products.map((product) => (
            <div className="table-row" key={product.sku}>
              <div className="product-name">
                <div className="product-avatar">
                  {product.name.charAt(0)}
                </div>

                <div>
                  <strong>{product.name}</strong>
                  <span>{product.sku}</span>
                </div>
              </div>

              <span className="category">{product.category}</span>

              <div className="confidence">
                <div className="confidence-bar">
                  <div
                    style={{ width: `${product.confidence}%` }}
                  ></div>
                </div>

                <span>{product.confidence}%</span>
              </div>

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

                {product.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;