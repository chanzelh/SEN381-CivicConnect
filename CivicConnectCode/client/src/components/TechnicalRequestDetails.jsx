import "./TechnicalRequestDetails.css";

const fields = [
  ["Issue type", "issueType"],
  ["Device type", "deviceType"],
  ["Device name", "deviceName"],
  ["Manufacturer", "manufacturer"],
  ["Model", "model"],
  ["Software", "softwareName"],
  ["Software version", "softwareVersion"],
  ["Operating system", "operatingSystem"],
  ["Error message", "errorMessage"],
  ["Location", "location"],
  ["Date started", "dateStarted"],
  ["Impact", "impact"],
  ["Urgency", "urgency"],
  ["Troubleshooting already tried", "troubleshooting"],
];

function displayValue(value, key) {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (key === "dateStarted") {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  }

  return String(value);
}

export default function TechnicalRequestDetails({ request }) {
  if (!request) return null;

  const hasTechnicalDetails = fields.some(([, key]) => {
    const value = request[key];
    return value !== null && value !== undefined && value !== "";
  });

  if (!hasTechnicalDetails) {
    return (
      <section className="technical-details">
        <h3>Technical details</h3>
        <p className="technical-details-empty">
          No additional technical details were provided.
        </p>
      </section>
    );
  }

  return (
    <section className="technical-details">
      <h3>Technical details</h3>

      <div className="technical-details-grid">
        {fields.map(([label, key]) => {
          const value = request[key];

          if (
            value === null ||
            value === undefined ||
            value === ""
          ) {
            return null;
          }

          return (
            <div className="technical-detail-item" key={key}>
              <span className="technical-detail-label">
                {label}
              </span>

              <p className="technical-detail-value">
                {displayValue(value, key)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
