// components/ui/Alert.jsx
import React from "react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const alertBootstrapTypes = {
  error: "alert-danger",
  warning: "alert-warning",
  success: "alert-success",
  info: "alert-info",
};

const alertIcons = {
  error: XCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

export default function Alert({ type = "info", title, message, details = [], className = "" }) {
  const Icon = alertIcons[type] || Info;
  const alertClass = alertBootstrapTypes[type] || "alert-info";

  return (
    <div
      role="alert"
      className={`alert ${alertClass} d-flex align-items-start gap-3 shadow-sm rounded-3 p-3 ${className}`}
    >
      <Icon style={{ width: "20px", height: "20px", flexShrink: 0, marginTop: "2px" }} />
      <div className="w-100">
        {title && <h5 className="alert-heading h6 fw-semibold mb-1">{title}</h5>}
        {message && <p className="mb-0 small">{message}</p>}
        {details.length > 0 && (
          <ul className="mb-0 mt-2 ps-3 small text-monospace" style={{ maxHeight: "160px", overflowY: "auto" }}>
            {details.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}