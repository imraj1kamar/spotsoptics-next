// components/ui/Modal.jsx
import React from "react";

export default function Modal({ isOpen, onClose, title, children, maxWidth = "modal-lg" }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(4px)", zIndex: 1050 }}
    >
      <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable px-2 px-sm-0 ${maxWidth}`}>
        <div className="modal-content shadow-lg border-0 rounded-3 overflow-hidden">
          <div className="modal-header px-3 px-sm-4 py-3 border-bottom">
            <h5 className="modal-title h6 fw-semibold text-dark">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body p-3 p-sm-4">{children}</div>
        </div>
      </div>
    </div>
  );
}