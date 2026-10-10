// components/ui/Card.jsx
import React from "react";

export default function Card({ children, title, subtitle, className = "", headerAction }) {
  return (
    <div className={`card shadow-sm border rounded-3 overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="card-header bg-white border-bottom px-3 px-sm-4 py-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
          <div>
            {title && <h3 className="h6 mb-0 fw-semibold text-dark">{title}</h3>}
            {subtitle && <p className="small text-muted mb-0 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div className="mt-2 mt-sm-0">{headerAction}</div>}
        </div>
      )}
      <div className="card-body p-3 p-sm-4">{children}</div>
    </div>
  );
}