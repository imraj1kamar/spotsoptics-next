// components/ui/Button.jsx
import React from "react";

const buttonVariants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline-secondary",
  danger: "btn-danger",
  ghost: "btn-link text-decoration-none",
};

const buttonSizes = {
  sm: "btn-sm px-3 py-1",
  md: "px-3 py-2 fs-6",
  lg: "btn-lg px-4 py-2 fs-5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading,
  loading,
  disabled = false,
  icon: Icon,
  ...props
}) {
  const isButtonLoading = Boolean(isLoading || loading);
  const variantClass = buttonVariants[variant] || `btn-${variant}`;
  const sizeClass = buttonSizes[size] || "px-3 py-2";

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      disabled={disabled || isButtonLoading}
      {...props}
    >
      {isButtonLoading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      )}
      {!isButtonLoading && Icon && <Icon style={{ width: "16px", height: "16px" }} />}
      {children}
    </button>
  );
}