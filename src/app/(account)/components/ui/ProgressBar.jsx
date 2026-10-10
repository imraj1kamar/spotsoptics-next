// components/ui/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ progress = 0, label, description }) {
  const percentage = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="w-100 d-flex flex-column gap-1">
      <div className="d-flex justify-content-between align-items-center small">
        <span className="fw-semibold text-secondary">{label}</span>
        <span className="fw-bold text-primary small">{percentage}%</span>
      </div>
      <div className="progress" style={{ height: "10px", borderRadius: "20px" }}>
        <div
          className="progress-bar bg-primary progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: `${percentage}%`, borderRadius: "20px" }}
        />
      </div>
      {description && <p className="small text-muted mb-0">{description}</p>}
    </div>
  );
}