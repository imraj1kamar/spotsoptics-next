import React from 'react';

export default function ProductFeatures({ features = [], className = '' }) {
  // Agar features array khaali ho toh render nahi karega
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <ul className={`product-detail-features list-unstyled ${className}`.trim()}>
      {features.map((feature, index) => (
        <li key={index} className="feature-item mb-2">
          {/* HTML tags (jaise <strong>, <a>, <sup>, <sub>) ko safely render karne ke liye */}
          {typeof feature === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: feature }} />
          ) : (
            feature
          )}
        </li>
      ))}
    </ul>
  );
}