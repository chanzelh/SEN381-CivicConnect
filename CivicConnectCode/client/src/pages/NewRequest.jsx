import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandHeader from "../components/Header";
import Navbar from "../components/Navbar";
import SectionHeading from "../components/SectionHeading";

function NewRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Common fields
  const [location, setLocation] = useState("");
  const [impact, setImpact] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [dateStarted, setDateStarted] = useState("");

  // Existing technical fields
  const [issueType, setIssueType] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [softwareName, setSoftwareName] = useState("");
  const [softwareVersion, setSoftwareVersion] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [troubleshooting, setTroubleshooting] = useState("");

  // New dynamic fields
  const [maintenanceType, setMaintenanceType] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [damageDetails, setDamageDetails] = useState("");

  const [incidentType, setIncidentType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");

  const [itemDescription, setItemDescription] = useState("");
  const [lastKnownLocation, setLastKnownLocation] = useState("");
  const [dateLost, setDateLost] = useState("");

  const [otherRequestType, setOtherRequestType] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isIT = category === "IT Support";
  const isEquipment = category === "Equipment";
  const isTechnicalRequest = isIT || isEquipment;
  const isMaintenance = category === "Maintenance";
  const isSecurity = category === "Security";
  const isLostProperty = category === "Lost Property";
  const isOther = category === "Other Operational";

  const isHardware =
    issueType === "Hardware" || isEquipment;
  const isSoftware = issueType === "Software";
  const isNetwork = issueType === "Network";
  const isAccount = issueType === "Account / Access";

  function handleCategoryChange(event) {
    setCategory(event.target.value);

    // Clear fields belonging to the previous category.
    setIssueType("");
    setDeviceType("");
    setDeviceName("");
    setManufacturer("");
    setModel("");
    setSoftwareName("");
    setSoftwareVersion("");
    setOperatingSystem("");
    setErrorMessage("");
    setDateStarted("");
    setTroubleshooting("");

    setMaintenanceType("");
    setAffectedArea("");
    setDamageDetails("");
    setIncidentType("");
    setIncidentDate("");
    setItemDescription("");
    setLastKnownLocation("");
    setDateLost("");
    setOtherRequestType("");
    setAdditionalDetails("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !location.trim()
    ) {
      setError(
        "Please complete the title, category, description and location."
      );
      return;
    }

    if (isTechnicalRequest && !issueType) {
      setError("Please select the type of technical issue.");
      return;
    }

    if (isSoftware && !softwareName.trim()) {
      setError("Please enter the affected software or application.");
      return;
    }

    if (isMaintenance && !maintenanceType) {
      setError("Please select the maintenance issue type.");
      return;
    }

    if (isSecurity && !incidentType) {
      setError("Please select the security incident type.");
      return;
    }

    if (
      isLostProperty &&
      (!itemDescription.trim() || !lastKnownLocation.trim())
    ) {
      setError(
        "Please enter the lost item's description and last known location."
      );
      return;
    }

    if (isOther && !otherRequestType.trim()) {
      setError("Please describe the type of operational request.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // Existing request fields
            title: title.trim(),
            category,
            description: description.trim(),

            // Common details
            location: location.trim(),
            dateStarted: dateStarted || null,
            impact,
            urgency,

            // Existing technical details
            issueType: isTechnicalRequest ? issueType : null,
            deviceType: isTechnicalRequest ? deviceType || null : null,
            deviceName: isTechnicalRequest ? deviceName.trim() : "",
            manufacturer: isTechnicalRequest ? manufacturer.trim() : "",
            model: isTechnicalRequest ? model.trim() : "",
            softwareName: isTechnicalRequest ? softwareName.trim() : "",
            softwareVersion: isTechnicalRequest
              ? softwareVersion.trim()
              : "",
            operatingSystem: isTechnicalRequest ? operatingSystem : "",
            errorMessage: isTechnicalRequest
              ? errorMessage.trim()
              : "",
            troubleshooting: isTechnicalRequest
              ? troubleshooting.trim()
              : "",

            // Maintenance details
            maintenanceType: isMaintenance ? maintenanceType : "",
            affectedArea: isMaintenance ? affectedArea.trim() : "",

            // Equipment damage details
            damageDetails: isEquipment ? damageDetails.trim() : "",

            // Security details
            incidentType: isSecurity ? incidentType : "",
            incidentDate: isSecurity ? incidentDate || null : null,

            // Lost property details
            itemDescription: isLostProperty
              ? itemDescription.trim()
              : "",
            lastKnownLocation: isLostProperty
              ? lastKnownLocation.trim()
              : "",
            dateLost: isLostProperty ? dateLost || null : null,

            // Other operational requests
            otherRequestType: isOther ? otherRequestType.trim() : "",
            additionalDetails:
              isOther || isMaintenance
                ? additionalDetails.trim()
                : "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Your session has expired. Please log in again."
          );
          return;
        }

        throw new Error(
          data.message || "Could not submit your request."
        );
      }

      navigate("/requester", {
        state: {
          successMessage:
            "Your service request was submitted successfully.",
        },
      });
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the server. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page requester-page">
      <BrandHeader title="NEW SERVICE REQUEST" />
      <Navbar role="requester" />

      <main className="dashboard-content requester-content">
        <SectionHeading title="Submit a Service Request" />

        <p className="request-form-intro">
          Tell us what you need help with. Select a category to see
          the relevant fields and help our support team assist you.
        </p>

        <form className="request-form" onSubmit={handleSubmit}>
          {/* SECTION 1: BASIC INFORMATION */}
          <section className="request-form-section">
            <h3>1. Request Information</h3>
            <p className="form-section-description">
              Provide a clear title, category and description.
            </p>

            <div className="form-field">
              <label htmlFor="request-title">Request Title *</label>
              <input
                id="request-title"
                type="text"
                maxLength={150}
                placeholder="e.g. Water leak in Room 104"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="request-category">Category *</label>
              <select
                id="request-category"
                value={category}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Maintenance">Facilities / Maintenance</option>
                <option value="IT Support">IT Support</option>
                <option value="Security">Security Concern</option>
                <option value="Equipment">Damaged Equipment</option>
                <option value="Lost Property">Lost Property</option>
                <option value="Other Operational">
                  Other Operational Request
                </option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="request-description">
                Description *
              </label>
              <textarea
                id="request-description"
                rows={5}
                maxLength={5000}
                placeholder="Explain what happened and how the issue affects you."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <small>{description.length}/5000 characters</small>
            </div>
          </section>

          {/* SECTION 2: IT SUPPORT */}
          {isIT && (
            <section className="request-form-section">
              <h3>2. IT Support Details</h3>
              <p className="form-section-description">
                Describe the affected device, software or service.
              </p>

              <div className="form-field">
                <label htmlFor="issue-type">
                  Type of Technical Issue *
                </label>
                <select
                  id="issue-type"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="Hardware">Hardware problem</option>
                  <option value="Software">Software or application</option>
                  <option value="Network">Network or connectivity</option>
                  <option value="Account / Access">
                    Account or access
                  </option>
                  <option value="Other">Other technical issue</option>
                </select>
              </div>

              {(isHardware || isSoftware) && (
                <>
                  <div className="form-field">
                    <label htmlFor="device-type">Device Type</label>
                    <select
                      id="device-type"
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                    >
                      <option value="">Select a device</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Desktop">Desktop computer</option>
                      <option value="Printer">Printer</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Keyboard / Mouse">
                        Keyboard or mouse
                      </option>
                      <option value="Projector">Projector</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="device-name">
                      Device Name or Asset Number
                    </label>
                    <input
                      id="device-name"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="e.g. LAB-PC-014"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="manufacturer">Manufacturer</label>
                    <input
                      id="manufacturer"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="e.g. Dell, HP or Lenovo"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="device-model">Model</label>
                    <input
                      id="device-model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Enter the model if known"
                    />
                  </div>
                </>
              )}

              {isSoftware && (
                <>
                  <div className="form-field">
                    <label htmlFor="software-name">
                      Software / Application Name *
                    </label>
                    <input
                      id="software-name"
                      value={softwareName}
                      onChange={(e) => setSoftwareName(e.target.value)}
                      required
                      placeholder="e.g. Microsoft Teams"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="software-version">
                      Software Version
                    </label>
                    <input
                      id="software-version"
                      value={softwareVersion}
                      onChange={(e) => setSoftwareVersion(e.target.value)}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="operating-system">
                      Operating System
                    </label>
                    <select
                      id="operating-system"
                      value={operatingSystem}
                      onChange={(e) => setOperatingSystem(e.target.value)}
                    >
                      <option value="">Select operating system</option>
                      <option value="Windows 11">Windows 11</option>
                      <option value="Windows 10">Windows 10</option>
                      <option value="macOS">macOS</option>
                      <option value="Linux">Linux</option>
                      <option value="Android">Android</option>
                      <option value="iOS">iOS</option>
                      <option value="Other / Unknown">Other / Unknown</option>
                    </select>
                  </div>
                </>
              )}

              {isNetwork && (
                <div className="form-field">
                  <label htmlFor="network-type">Connection Type</label>
                  <select
                    id="network-type"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                  >
                    <option value="">Select connection</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                    <option value="Ethernet">Ethernet</option>
                    <option value="VPN">VPN</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {isAccount && (
                <div className="form-field">
                  <label htmlFor="account-system">
                    Account or System Affected
                  </label>
                  <input
                    id="account-system"
                    value={softwareName}
                    onChange={(e) => setSoftwareName(e.target.value)}
                    placeholder="e.g. student portal or university email"
                  />
                </div>
              )}

              <div className="form-field">
                <label htmlFor="error-message">
                  Error Message or Code
                </label>
                <textarea
                  id="error-message"
                  rows={3}
                  maxLength={2000}
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="Enter the exact error, if one appears."
                />
              </div>

              <div className="form-field">
                <label htmlFor="troubleshooting">
                  Troubleshooting Already Tried
                </label>
                <textarea
                  id="troubleshooting"
                  rows={3}
                  maxLength={2000}
                  value={troubleshooting}
                  onChange={(e) => setTroubleshooting(e.target.value)}
                  placeholder="e.g. restarted the computer or checked cables"
                />
              </div>
            </section>
          )}

          {/* SECTION 3: FACILITIES / MAINTENANCE */}
          {isMaintenance && (
            <section className="request-form-section">
              <h3>2. Facilities and Maintenance Details</h3>

              <div className="form-field">
                <label htmlFor="maintenance-type">
                  Maintenance Issue Type *
                </label>
                <select
                  id="maintenance-type"
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  required
                >
                  <option value="">Select issue type</option>
                  <option value="Plumbing">Plumbing or water leak</option>
                  <option value="Electrical">Electrical fault</option>
                  <option value="Air Conditioning">Air conditioning</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Furniture">Furniture or fittings</option>
                  <option value="Building Damage">Building damage</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other maintenance</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="affected-area">Affected Area</label>
                <input
                  id="affected-area"
                  value={affectedArea}
                  onChange={(e) => setAffectedArea(e.target.value)}
                  placeholder="e.g. ceiling, window, sink or lights"
                />
              </div>

              <div className="form-field">
                <label htmlFor="maintenance-details">
                  Additional Details
                </label>
                <textarea
                  id="maintenance-details"
                  rows={3}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Describe the fault or maintenance needed."
                />
              </div>
            </section>
          )}

          {/* SECTION 4: DAMAGED EQUIPMENT */}
          {isEquipment && (
            <section className="request-form-section">
              <h3>2. Damaged Equipment Details</h3>

              <div className="form-field">
                <label htmlFor="equipment-type">Equipment Type *</label>
                <select
                  id="equipment-type"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  required
                >
                  <option value="">Select equipment</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop computer</option>
                  <option value="Printer">Printer</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Projector">Projector</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Laboratory Equipment">
                    Laboratory equipment
                  </option>
                  <option value="Other">Other equipment</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="equipment-asset">
                  Asset Number or Device Name
                </label>
                <input
                  id="equipment-asset"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="Enter the asset number if available"
                />
              </div>

              <div className="form-field">
                <label htmlFor="equipment-manufacturer">Manufacturer</label>
                <input
                  id="equipment-manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="equipment-model">Model</label>
                <input
                  id="equipment-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor="damage-details">Damage Details *</label>
                <textarea
                  id="damage-details"
                  rows={4}
                  value={damageDetails}
                  onChange={(e) => setDamageDetails(e.target.value)}
                  required
                  placeholder="Explain what is damaged and whether the equipment still works."
                />
              </div>
            </section>
          )}

          {/* SECTION 5: SECURITY */}
          {isSecurity && (
            <section className="request-form-section">
              <h3>2. Security Incident Details</h3>

              <div className="form-field">
                <label htmlFor="incident-type">Incident Type *</label>
                <select
                  id="incident-type"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  required
                >
                  <option value="">Select incident type</option>
                  <option value="Suspicious Activity">Suspicious activity</option>
                  <option value="Theft">Theft</option>
                  <option value="Unauthorised Access">Unauthorised access</option>
                  <option value="Property Damage">Property damage</option>
                  <option value="Safety Hazard">Safety hazard</option>
                  <option value="Harassment or Threat">
                    Harassment or threat
                  </option>
                  <option value="Other">Other security concern</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="incident-date">
                  Date and Time of Incident
                </label>
                <input
                  id="incident-date"
                  type="datetime-local"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                />
              </div>

              <p className="form-help-note">
                If there is immediate danger, contact campus security or
                emergency services directly. Do not wait for this request
                to be processed.
              </p>
            </section>
          )}

          {/* SECTION 6: LOST PROPERTY */}
          {isLostProperty && (
            <section className="request-form-section">
              <h3>2. Lost Property Details</h3>

              <div className="form-field">
                <label htmlFor="item-description">
                  Description of Lost Item *
                </label>
                <textarea
                  id="item-description"
                  rows={3}
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  required
                  placeholder="Describe the item, colour, brand or identifying features."
                />
              </div>

              <div className="form-field">
                <label htmlFor="last-known-location">
                  Last Known Location *
                </label>
                <input
                  id="last-known-location"
                  value={lastKnownLocation}
                  onChange={(e) => setLastKnownLocation(e.target.value)}
                  required
                  placeholder="Where did you last see the item?"
                />
              </div>

              <div className="form-field">
                <label htmlFor="date-lost">Date and Time Lost</label>
                <input
                  id="date-lost"
                  type="datetime-local"
                  value={dateLost}
                  onChange={(e) => setDateLost(e.target.value)}
                />
              </div>
            </section>
          )}

          {/* SECTION 7: OTHER OPERATIONAL REQUEST */}
          {isOther && (
            <section className="request-form-section">
              <h3>2. Other Operational Request Details</h3>

              <div className="form-field">
                <label htmlFor="other-request-type">
                  Request Type *
                </label>
                <input
                  id="other-request-type"
                  value={otherRequestType}
                  onChange={(e) => setOtherRequestType(e.target.value)}
                  required
                  placeholder="e.g. access request or general operational issue"
                />
              </div>

              <div className="form-field">
                <label htmlFor="other-additional-details">
                  Additional Details
                </label>
                <textarea
                  id="other-additional-details"
                  rows={4}
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  placeholder="Provide any other information that may help."
                />
              </div>
            </section>
          )}

          {/* COMMON LOCATION AND PRIORITY */}
          <section className="request-form-section">
            <h3>
              {isTechnicalRequest ||
              isMaintenance ||
              isEquipment ||
              isSecurity ||
              isLostProperty ||
              isOther
                ? "3."
                : "2."}{" "}
              Location and Priority
            </h3>

            <div className="form-field">
              <label htmlFor="request-location">Location *</label>
              <input
                id="request-location"
                type="text"
                maxLength={200}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main building, Lab 2, Room 104"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="date-started">
                When Did the Issue Start?
              </label>
              <input
                id="date-started"
                type="datetime-local"
                value={dateStarted}
                onChange={(e) => setDateStarted(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="request-impact">Impact on Your Work</label>
              <select
                id="request-impact"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
              >
                <option value="">Select the impact</option>
                <option value="Minor inconvenience">
                  Minor inconvenience
                </option>
                <option value="Work slowed down">
                  Work or studies slowed down
                </option>
                <option value="Unable to complete work">
                  Unable to complete work or studies
                </option>
                <option value="Multiple people affected">
                  Multiple people affected
                </option>
                <option value="Service unavailable">
                  An important service is unavailable
                </option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="request-urgency">
                Requested Priority *
              </label>
              <select
                id="request-urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                required
              >
                <option value="Low">Low — minor inconvenience</option>
                <option value="Normal">Normal — work is affected</option>
                <option value="High">High — important work is blocked</option>
                <option value="Urgent">
                  Urgent — serious or time-critical issue
                </option>
              </select>
              <small>
                The support team may adjust the official priority after
                reviewing your request.
              </small>
            </div>
          </section>

          <p className="form-help-note">
            Do not include passwords or other sensitive information.
            Fields marked with * are required.
          </p>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/requester")}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default NewRequest;