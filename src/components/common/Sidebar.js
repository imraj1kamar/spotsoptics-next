import React from 'react';
import Link from 'next/link';
import "../../../public/assets/css/sidebar.css"

export default function Sidebar({
  title = 'Categories',
  links = [],
  className = '',
}) {
  // Agar links array khaali ho toh component render nahi hoga
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className={`sidebar-card card p-3 shadow-sm ${className}`.trim()}>
      {/* Sidebar Heading */}
      {title && <h4 className="sidebar-title h5 mb-2">{title}</h4>}

      {/* Decorative Divider Line */}
      <div className="sidebar-line border-bottom mb-3" />

      {/* Navigation Links */}
      <ul className="list-unstyled mb-0">
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <Link
              href={link.url || '#'}
              className="text-decoration-none text-dark d-flex align-items-center gap-2 sidebar-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary flex-shrink-0"
              >
                <path d="M3 7h5l2 2h11v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              </svg>
              <span>{link.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}