import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  Sparkles,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    description: "",
    website: "",
  });

  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setImage(file);
    }
  };

  const handleDocument = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setDocument(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const removeDocument = () => {
    setDocument(null);
  };

  const handleGenerate = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    /*
      Temporary local demo flow.

      Later this button will call:
      Frontend → Backend → AI Extraction → Enrichment → Validation
    */

    navigate("/products/1");
  };

  return (
    <main className="dashboard">

      {/* HEADER */}

      <div className="add-product-header">

        <div>
          <Link
            to="/products"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <p className="eyebrow">
            PRODUCT INGESTION
          </p>

          <h1>Add Product</h1>

          <p className="page-description">
            Provide limited product information and let
            ForgeIntel build structured product intelligence.
          </p>
        </div>

      </div>

      <form
        className="add-product-layout"
        onSubmit={handleGenerate}
      >

        {/* LEFT — PRODUCT INFORMATION */}

        <section className="content-card add-product-card">

          <div className="section-header">
            <div>
              <h2>Product Information</h2>

              <p>
                Enter whatever information is currently available.
              </p>
            </div>
          </div>

          <div className="form-content">

            {/* PRODUCT NAME */}

            <div className="form-group full-width">

              <label>
                Product Name
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Industrial Hydraulic Pump"
                value={formData.name}
                onChange={handleChange}
              />

              <small>
                This is the minimum information required
                to start intelligence generation.
              </small>

            </div>

            {/* SKU */}

            <div className="form-group">

              <label>SKU / Part Number</label>

              <input
                type="text"
                name="sku"
                placeholder="e.g. HYD-450"
                value={formData.sku}
                onChange={handleChange}
              />

            </div>

            {/* BRAND */}

            <div className="form-group">

              <label>Brand</label>

              <input
                type="text"
                name="brand"
                placeholder="e.g. Hydronex"
                value={formData.brand}
                onChange={handleChange}
              />

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>Category</label>

              <input
                type="text"
                name="category"
                placeholder="e.g. Hydraulic Equipment"
                value={formData.category}
                onChange={handleChange}
              />

            </div>

            {/* WEBSITE */}

            <div className="form-group">

              <label>Product Website</label>

              <input
                type="url"
                name="website"
                placeholder="https://manufacturer.com/product"
                value={formData.website}
                onChange={handleChange}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group full-width">

              <label>Short Description</label>

              <textarea
                name="description"
                rows="5"
                placeholder="Enter any available product description..."
                value={formData.description}
                onChange={handleChange}
              />

            </div>

          </div>

        </section>

        {/* RIGHT — FILES */}

        <section className="content-card upload-card">

          <div className="section-header">

            <div>
              <h2>Digital Assets</h2>

              <p>
                Add product images or technical documents
                when available.
              </p>
            </div>

          </div>

          <div className="upload-content">

            {/* IMAGE */}

            <div className="upload-section">

              <label className="upload-label">
                Product Image
              </label>

              {!image ? (
                <label className="upload-box">

                  <Image size={25} />

                  <strong>
                    Upload product image
                  </strong>

                  <span>
                    PNG, JPG or WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImage}
                    hidden
                  />

                </label>
              ) : (
                <div className="selected-file">

                  <div className="selected-file-icon">
                    <Image size={20} />
                  </div>

                  <div>
                    <strong>
                      {image.name}
                    </strong>

                    <span>
                      Product image selected
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-file"
                  >
                    <X size={17} />
                  </button>

                </div>
              )}

            </div>

            {/* DOCUMENT */}

            <div className="upload-section">

              <label className="upload-label">
                Technical Document
              </label>

              {!document ? (
                <label className="upload-box">

                  <FileText size={25} />

                  <strong>
                    Upload technical document
                  </strong>

                  <span>
                    PDF, DOC or TXT
                  </span>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocument}
                    hidden
                  />

                </label>
              ) : (
                <div className="selected-file">

                  <div className="selected-file-icon">
                    <FileText size={20} />
                  </div>

                  <div>
                    <strong>
                      {document.name}
                    </strong>

                    <span>
                      Technical document selected
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={removeDocument}
                    className="remove-file"
                  >
                    <X size={17} />
                  </button>

                </div>
              )}

            </div>

            {/* INFO */}

            <div className="ingestion-info">

              <Sparkles size={19} />

              <div>
                <strong>
                  ForgeIntel Intelligence Engine
                </strong>

                <p>
                  Product information, documents and
                  digital assets will be analyzed to
                  extract and enrich structured attributes.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ACTION */}

        <div className="add-product-actions">

          <Link
            to="/products"
            className="secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="generate-button"
          >
            <Sparkles size={18} />
            Generate Intelligence
          </button>

        </div>

      </form>

    </main>
  );
}

export default AddProduct;