import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Database,
  Bell,
  SlidersHorizontal,
  Save,
} from "lucide-react";


// =========================================================
// DEFAULT SETTINGS
// =========================================================

const defaultSettings = {
  autoValidation: true,
  autoEnrichment: true,
  reviewThreshold: 70,
  emailNotifications: true,
  evidenceTracking: true,
};


// =========================================================
// SETTINGS PAGE
// =========================================================

function Settings() {
  const [settings, setSettings] =
    useState(defaultSettings);

  const [saved, setSaved] =
    useState(false);


  // =======================================================
  // LOAD SAVED SETTINGS
  // =======================================================

  useEffect(() => {
    const savedSettings =
      localStorage.getItem(
        "forgeintel_settings"
      );

    if (!savedSettings) {
      return;
    }

    try {
      const parsedSettings =
        JSON.parse(savedSettings);

      setSettings({
        ...defaultSettings,
        ...parsedSettings,
      });
    } catch (error) {
      console.error(
        "Unable to load ForgeIntel settings:",
        error
      );
    }
  }, []);


  // =======================================================
  // HANDLE CHANGE
  // =======================================================

  const handleChange = (
    name,
    value
  ) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };


  // =======================================================
  // SAVE SETTINGS
  // =======================================================

  const handleSave = () => {
    localStorage.setItem(
      "forgeintel_settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };


  return (
    <main className="dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            SYSTEM
          </p>

          <h1>
            Settings
          </h1>

          <p className="page-description">
            Configure ForgeIntel intelligence,
            validation and notification preferences.
          </p>

        </div>

      </div>


      {/* =================================================
          INTELLIGENCE ENGINE
      ================================================= */}

      <section className="content-card settings-card">

        <div className="section-header">

          <div className="settings-section-title">

            <div className="settings-icon blue">
              <SlidersHorizontal size={20} />
            </div>

            <div>

              <h2>
                Intelligence Engine
              </h2>

              <p>
                Control how product intelligence
                is generated and validated.
              </p>

            </div>

          </div>

        </div>


        <div className="settings-list">

          {/* AUTOMATIC VALIDATION */}

          <div className="setting-row">

            <div className="setting-info">

              <strong>
                Automatic Validation
              </strong>

              <span>
                Automatically validate extracted
                product attributes against
                available evidence.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  settings.autoValidation
                }
                onChange={(event) =>
                  handleChange(
                    "autoValidation",
                    event.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>


          {/* AUTOMATIC ENRICHMENT */}

          <div className="setting-row">

            <div className="setting-info">

              <strong>
                Automatic Enrichment
              </strong>

              <span>
                Generate additional product
                attributes using industrial knowledge.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  settings.autoEnrichment
                }
                onChange={(event) =>
                  handleChange(
                    "autoEnrichment",
                    event.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>


          {/* EVIDENCE */}

          <div className="setting-row">

            <div className="setting-info">

              <strong>
                Evidence & Traceability
              </strong>

              <span>
                Store the source and evidence
                type for every generated attribute.
              </span>

            </div>

            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  settings.evidenceTracking
                }
                onChange={(event) =>
                  handleChange(
                    "evidenceTracking",
                    event.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>

        </div>

      </section>


      {/* =================================================
          REVIEW & VALIDATION
      ================================================= */}

      <section className="content-card settings-card">

        <div className="section-header">

          <div className="settings-section-title">

            <div className="settings-icon orange">
              <ShieldCheck size={20} />
            </div>

            <div>

              <h2>
                Review & Validation
              </h2>

              <p>
                Define when human review
                should be required.
              </p>

            </div>

          </div>

        </div>


        <div className="settings-list">

          <div className="setting-row threshold-row">

            <div className="setting-info">

              <strong>
                Review Confidence Threshold
              </strong>

              <span>
                Attributes below this confidence
                level will require human review.
              </span>

            </div>


            <div className="threshold-control">

              <input
                type="range"
                min="50"
                max="95"
                value={
                  settings.reviewThreshold
                }
                onChange={(event) =>
                  handleChange(
                    "reviewThreshold",
                    Number(
                      event.target.value
                    )
                  )
                }
              />

              <strong>
                {settings.reviewThreshold}%
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          NOTIFICATIONS
      ================================================= */}

      <section className="content-card settings-card">

        <div className="section-header">

          <div className="settings-section-title">

            <div className="settings-icon purple">
              <Bell size={20} />
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Configure alerts for product
                review activity.
              </p>

            </div>

          </div>

        </div>


        <div className="settings-list">

          <div className="setting-row">

            <div className="setting-info">

              <strong>
                Review Notifications
              </strong>

              <span>
                Receive notifications when products
                require human validation.
              </span>

            </div>


            <label className="settings-switch">

              <input
                type="checkbox"
                checked={
                  settings.emailNotifications
                }
                onChange={(event) =>
                  handleChange(
                    "emailNotifications",
                    event.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>

        </div>

      </section>


      {/* =================================================
          SYSTEM STATUS
      ================================================= */}

      <section className="content-card settings-card">

        <div className="section-header">

          <div className="settings-section-title">

            <div className="settings-icon green">
              <Database size={20} />
            </div>

            <div>

              <h2>
                System Status
              </h2>

              <p>
                Current ForgeIntel system information.
              </p>

            </div>

          </div>

        </div>


        <div className="system-status-grid">

          <div className="system-status-item">

            <span>
              Intelligence Engine
            </span>

            <strong className="system-online">
              <span></span>
              Operational
            </strong>

          </div>


          <div className="system-status-item">

            <span>
              Product Database
            </span>

            <strong className="system-online">
              <span></span>
              Connected
            </strong>

          </div>


          <div className="system-status-item">

            <span>
              Evidence Processing
            </span>

            <strong className="system-online">
              <span></span>
              Available
            </strong>

          </div>

        </div>

      </section>


      {/* =================================================
          SAVE
      ================================================= */}

      <div className="settings-actions">

        {saved && (
          <span className="settings-saved">
            Settings saved successfully.
          </span>
        )}

        <button
          type="button"
          className="generate-button"
          onClick={handleSave}
        >
          <Save size={18} />
          Save Settings
        </button>

      </div>

    </main>
  );
}


export default Settings;