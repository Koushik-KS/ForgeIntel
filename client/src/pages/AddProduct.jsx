import { useState } from "react";

import {
  ArrowLeft,
  FileText,
  Image,
  Sparkles,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { extractPdfText } from "../services/pdfExtractor";


function AddProduct() {
  const navigate = useNavigate();


  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    description: "",
    website: "",
  });


  // =====================================================
  // FILE STATES
  // =====================================================

  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);


  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // HANDLE IMAGE
  // =====================================================

  const handleImage = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setImage(file);
    }
  };


  // =====================================================
  // HANDLE DOCUMENT
  // =====================================================

  const handleDocument = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setDocument(file);
    }
  };


  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {
    setImage(null);
  };


  // =====================================================
  // REMOVE DOCUMENT
  // =====================================================

  const removeDocument = () => {
    setDocument(null);
  };


  // =====================================================
  // GENERATE PRODUCT INTELLIGENCE
  // =====================================================

  const handleGenerate = async (event) => {
    event.preventDefault();


    // Check product name
    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }


    setLoading(true);


    try {
      let pdfData = null;


      // ===============================================
      // EXTRACT PDF TEXT
      // ===============================================

      if (document) {
        pdfData = await extractPdfText(document);
      }


      // ===============================================
      // SEND DATA TO RENDER BACKEND
      // ===============================================

      const response = await fetch(
        "https://forgeintel.onrender.com/api/intelligence/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,

            imageName: image?.name || null,

            documentName: document?.name || null,

            pdfData,
          }),
        }
      );


      // ===============================================
      // GET RESPONSE
      // ===============================================

      const data = await response.json();


      // ===============================================
      // HANDLE ERROR
      // ===============================================

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Failed to generate product intelligence."
        );
      }


      // ===============================================
      // GO TO PROCESSING PAGE
      // ===============================================

      navigate("/processing", {
        state: {
          product: data.product,
        },
      });


    } catch (error) {

      console.error(
        "Product intelligence generation error:",
        error
      );


      alert(
        error.message ||
        "Failed to generate product intelligence."
      );


    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

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


          <h1>
            Add Product
          </h1>


          <p className="page-description">
            Provide limited product information and let
            ForgeIntel build structured product intelligence.
          </p>

        </div>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="add-product-layout"
        onSubmit={handleGenerate}
      >


        {/* =================================================
            LEFT — PRODUCT INFORMATION
        ================================================= */}

        <section className="content-card add-product-card">

          <div className="section-header">

            <div>

              <h2>
                Product Information
              </h2>


              <p>
                Enter whatever information is currently
                available.
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
                disabled={loading}
              />


              <small>
                This is the minimum information required
                to start intelligence generation.
              </small>

            </div>


            {/* SKU */}

            <div className="form-group">

              <label>
                SKU / Part Number
              </label>


              <input
                type="text"
                name="sku"
                placeholder="e.g. HYD-450"
                value={formData.sku}
                onChange={handleChange}
                disabled={loading}
              />

            </div>


            {/* BRAND */}

            <div className="form-group">

              <label>
                Brand
              </label>


              <input
                type="text"
                name="brand"
                placeholder="e.g. Hydronex"
                value={formData.brand}
                onChange={handleChange}
                disabled={loading}
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>


              <input
                type="text"
                name="category"
                placeholder="e.g. Hydraulic Equipment"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              />

            </div>


            {/* WEBSITE */}

            <div className="form-group">

              <label>
                Product Website
              </label>


              <input
                type="url"
                name="website"
                placeholder="https://manufacturer.com/product"
                value={formData.website}
                onChange={handleChange}
                disabled={loading}
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group full-width">

              <label>
                Short Description
              </label>


              <textarea
                name="description"
                rows="5"
                placeholder="Enter any available product description..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
              />

            </div>

          </div>

        </section>


        {/* =================================================
            RIGHT — DIGITAL ASSETS
        ================================================= */}

        <section className="content-card upload-card">

          <div className="section-header">

            <div>

              <h2>
                Digital Assets
              </h2>


              <p>
                Add product images or technical documents
                when available.
              </p>

            </div>

          </div>


          <div className="upload-content">


            {/* PRODUCT IMAGE */}

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
                    disabled={loading}
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
                    disabled={loading}
                    aria-label="Remove image"
                  >
                    <X size={17} />
                  </button>

                </div>

              )}

            </div>


            {/* TECHNICAL DOCUMENT */}

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
                    PDF technical documents
                  </span>


                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleDocument}
                    hidden
                    disabled={loading}
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
                      PDF technical document selected
                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={removeDocument}
                    className="remove-file"
                    disabled={loading}
                    aria-label="Remove document"
                  >
                    <X size={17} />
                  </button>

                </div>

              )}

            </div>


            {/* FORGEINTEL INFO */}

            <div className="ingestion-info">

              <Sparkles size={19} />


              <div>

                <strong>
                  ForgeIntel Intelligence Engine
                </strong>


                <p>
                  Product information and technical
                  documents will be analyzed to extract
                  and enrich structured attributes.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

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
            disabled={loading}
          >

            <Sparkles size={18} />


            {loading
              ? "Generating..."
              : "Generate Intelligence"}

          </button>

        </div>

      </form>

    </main>
  );
}


export default AddProduct;