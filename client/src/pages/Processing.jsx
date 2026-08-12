import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  ShieldCheck,
  FileSearch,
  Database,
  ArrowRight,
} from "lucide-react";

import {
  generateProductIntelligence,
} from "../services/intelligenceEngine";


const processingSteps = [
  {
    id: 1,
    title: "Extracting information",
    description:
      "Reading available product information and technical details.",
    icon: FileSearch,
  },
  {
    id: 2,
    title: "Normalizing attributes",
    description:
      "Converting product information into a consistent structure.",
    icon: Database,
  },
  {
    id: 3,
    title: "Enriching product data",
    description:
      "Building additional structured product attributes.",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Checking evidence",
    description:
      "Associating available information with traceable sources.",
    icon: FileSearch,
  },
  {
    id: 5,
    title: "Validating attributes",
    description:
      "Checking consistency and identifying uncertain values.",
    icon: ShieldCheck,
  },
  {
    id: 6,
    title: "Calculating confidence",
    description:
      "Assigning confidence scores to generated intelligence.",
    icon: ShieldCheck,
  },
];


function Processing() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [currentStep, setCurrentStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const [intelligence, setIntelligence] =
    useState(null);


  // =====================================================
  // PROCESS PRODUCT
  // =====================================================

  useEffect(() => {
    if (!product) {
      navigate("/add-product");
      return;
    }

    const timers = [];

    processingSteps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
      }, (index + 1) * 900);

      timers.push(timer);
    });


    const finishTimer = setTimeout(() => {

      // ================================================
      // GENERATE PRODUCT INTELLIGENCE
      // ================================================

      const generatedIntelligence =
        generateProductIntelligence(product);


      // ================================================
      // GET EXISTING PRODUCTS
      // ================================================

      const savedProducts =
        JSON.parse(
          localStorage.getItem(
            "forgeintel_products"
          ) || "[]"
        );


      // ================================================
      // ADD NEW PRODUCT
      // ================================================

      const updatedProducts = [
        ...savedProducts,
        generatedIntelligence,
      ];


      // ================================================
      // SAVE ALL PRODUCTS
      // ================================================

      localStorage.setItem(
        "forgeintel_products",
        JSON.stringify(updatedProducts)
      );


      // ================================================
      // SAVE CURRENT GENERATED PRODUCT
      // Keep temporarily for compatibility
      // ================================================

      localStorage.setItem(
        "forgeintel_generated_product",
        JSON.stringify(generatedIntelligence)
      );


      // ================================================
      // SAVE IN COMPONENT STATE
      // ================================================

      setIntelligence(generatedIntelligence);

      setComplete(true);

    }, processingSteps.length * 900 + 500);


    timers.push(finishTimer);


    return () => {
      timers.forEach(clearTimeout);
    };

  }, [product, navigate]);


  // =====================================================
  // CONTINUE TO PRODUCT DETAILS
  // =====================================================

  const handleContinue = () => {
    if (!intelligence) {
      return;
    }

    navigate(
      `/products/${intelligence.id}`
    );
  };


  return (
    <main className="dashboard processing-page">

      <div className="processing-wrapper">


        {/* HEADER */}

        <div className="processing-header">

          <div className="processing-logo">
            <Sparkles size={25} />
          </div>

          <p className="eyebrow">
            FORGEINTEL ENGINE
          </p>

          <h1>
            Building Product Intelligence
          </h1>

          <p>
            Analyzing available information for{" "}
            <strong>
              {product?.name}
            </strong>
          </p>

        </div>


        {/* PROGRESS */}

        <section className="content-card processing-card">

          <div className="processing-progress">

            <div className="processing-progress-bar">

              <div
                style={{
                  width: `${Math.min(
                    (currentStep /
                      processingSteps.length) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

            <span>
              {complete
                ? "Processing complete"
                : `${currentStep} of ${processingSteps.length} stages`}
            </span>

          </div>


          {/* PROCESSING STEPS */}

          <div className="processing-steps">

            {processingSteps.map((step) => {

              const Icon = step.icon;

              const isComplete =
                complete ||
                currentStep > step.id;

              const isCurrent =
                !complete &&
                currentStep === step.id;


              return (
                <div
                  key={step.id}
                  className={`processing-step ${
                    isComplete
                      ? "step-complete"
                      : isCurrent
                      ? "step-current"
                      : ""
                  }`}
                >

                  <div className="step-icon">

                    {isComplete ? (
                      <CheckCircle2 size={19} />
                    ) : isCurrent ? (
                      <LoaderCircle
                        size={19}
                        className="spin"
                      />
                    ) : (
                      <Icon size={19} />
                    )}

                  </div>


                  <div className="step-content">

                    <strong>
                      {step.title}
                    </strong>

                    <p>
                      {step.description}
                    </p>

                  </div>


                  <div className="step-status">

                    {isComplete
                      ? "Complete"
                      : isCurrent
                      ? "Processing"
                      : "Waiting"}

                  </div>

                </div>
              );
            })}

          </div>


          {/* COMPLETE */}

          {complete && intelligence && (

            <div className="processing-complete">

              <div className="complete-icon">
                <CheckCircle2 size={28} />
              </div>

              <div>

                <strong>
                  Product intelligence generated
                </strong>

                <p>
                  ForgeIntel has completed extraction,
                  enrichment and validation and saved
                  the product intelligence.
                </p>

              </div>

              <button
                type="button"
                onClick={handleContinue}
                className="generate-button"
              >
                View Intelligence
                <ArrowRight size={17} />
              </button>

            </div>

          )}

        </section>

      </div>

    </main>
  );
}


export default Processing;