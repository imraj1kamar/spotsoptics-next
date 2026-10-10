// components/ui/DynamicForm.jsx
"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "@/app/(account)/components/ui/Button";

export default function DynamicForm({
  fields = [],
  formData = {},
  errors = {},
  onChange,
  onSubmit,
  submitLabel = "Submit",
  isLoading = false,
  className = "",
  submitButton = null,
}) {
  const [visible, setVisible] = useState({});

  const handleInputChange = (name, value) => {
    onChange({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className={`d-flex flex-column gap-3 ${className}`}>
      {fields.map((field) => {
        const {
          name,
          label,
          type = "text",
          placeholder = "",
          required = false,
          options = [],
          icon: Icon,
          rows = 3,
        } = field;

        const value = formData[name] ?? "";
        const error = errors[name];
        const isPassword = type === "password";
        const inputStateClass = error ? "is-invalid" : "";

        if (type === "checkbox") {
          return (
            <div key={name} className="form-check text-start">
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={!!formData[name]}
                onChange={(e) => handleInputChange(name, e.target.checked)}
                className={`form-check-input ${inputStateClass}`}
              />
              <label htmlFor={name} className="form-check-label small text-dark cursor-pointer">
                {label}
              </label>
            </div>
          );
        }

        return (
          <div key={name} className="text-start mb-2">
            {label && (
              <label htmlFor={name} className="form-label small fw-semibold text-dark mb-1">
                {label} {required && <span className="text-danger">*</span>}
              </label>
            )}

            <div className="position-relative">
              {Icon && (
                <span
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                  style={{ zIndex: 5, pointerEvents: "none" }}
                >
                  <Icon style={{ width: "16px", height: "16px" }} />
                </span>
              )}

              {type === "select" ? (
                <select
                  id={name}
                  name={name}
                  value={value}
                  required={required}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className={`form-select ${inputStateClass}`}
                  style={{ paddingLeft: Icon ? "2.5rem" : undefined }}
                >
                  <option value="" disabled>
                    {placeholder || `Select ${label}`}
                  </option>
                  {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : type === "textarea" ? (
                <textarea
                  id={name}
                  name={name}
                  rows={rows}
                  value={value}
                  required={required}
                  placeholder={placeholder}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className={`form-control ${inputStateClass}`}
                  style={{ paddingLeft: Icon ? "2.5rem" : undefined }}
                />
              ) : type === "file" ? (
                <input
                  id={name}
                  type="file"
                  name={name}
                  required={required}
                  onChange={(e) => handleInputChange(name, e.target.files[0])}
                  className={`form-control form-control-sm ${inputStateClass}`}
                />
              ) : (
                <input
                  id={name}
                  type={isPassword && visible[name] ? "text" : type}
                  name={name}
                  value={value}
                  required={required}
                  placeholder={placeholder}
                  autoComplete={isPassword ? "current-password" : type === "email" ? "email" : undefined}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                  className={`form-control ${inputStateClass}`}
                  style={{
                    paddingLeft: Icon ? "2.5rem" : undefined,
                    paddingRight: isPassword ? "2.5rem" : undefined,
                  }}
                />
              )}

              {isPassword && (
                <button
                  type="button"
                  onClick={() => setVisible((v) => ({ ...v, [name]: !v[name] }))}
                  aria-label={visible[name] ? "Hide password" : "Show password"}
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted p-2 me-1"
                  style={{ textDecoration: "none" }}
                >
                  {visible[name] ? (
                    <EyeOff style={{ width: "16px", height: "16px" }} />
                  ) : (
                    <Eye style={{ width: "16px", height: "16px" }} />
                  )}
                </button>
              )}
            </div>

            {error && <div className="invalid-feedback d-block small mt-1">{error}</div>}
          </div>
        );
      })}

      {submitButton ? (
        submitButton
      ) : (
        <Button type="submit" variant="primary" size="md" className="w-100 mt-3" isLoading={isLoading}>
          {submitLabel}
        </Button>
      )}
    </form>
  );
}