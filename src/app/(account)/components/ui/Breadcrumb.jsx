// components/ui/Breadcrumb.jsx
import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items = [], className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`d-flex align-items-center small text-secondary ${className}`}>
      <ol className="breadcrumb mb-0 d-flex align-items-center flex-wrap" style={{ gap: "6px" }}>
        <li className="breadcrumb-item d-inline-flex align-items-center">
          <Link href="/" className="text-decoration-none d-inline-flex align-items-center gap-1 text-secondary fw-medium">
            <Home style={{ width: "14px", height: "14px" }} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="breadcrumb-item d-inline-flex align-items-center">
              <ChevronRight style={{ width: "14px", height: "14px" }} className="text-muted mx-1" />
              {isLast || !item.href ? (
                <span className="fw-semibold text-dark">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-decoration-none text-secondary fw-medium">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}