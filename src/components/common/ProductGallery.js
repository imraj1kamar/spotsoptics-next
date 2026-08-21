import React, { useState } from 'react';
import Image from 'next/image';
// Application SVG Icons Map
const APP_ICONS = {
  laser: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 14.5l-4 4m0-6l4 4m-4-8l4 4m-4-6l4 4M3 21l4-4m10-12l4 4m-6 4l4 4m-6-4l4-4m2 2l4-4M7 3l4 4" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    </svg>
  ),
  wave: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  beam: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.5-6.5l-2.8 2.8m-7.4 7.4l-2.8 2.8m0-14l2.8 2.8m7.4 7.4l2.8 2.8" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    </svg>
  ),
  alignment: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" strokeWidth="1.5" fill="currentColor" />
    </svg>
  ),
  lens: (
    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6a6 6 0 100 12 6 6 0 000-12z" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
};

// Normalize image src (handles relative paths & object-style values)
const normalizeImageSrc = (src) => {
  if (!src) return '';
  let value = src;
  if (typeof value === 'object' && value) {
    value = value.url || '';
  }
  if (typeof value !== 'string' || value.trim() === '') return '';
  value = value.trim();
  // Ensure leading slash for public-relative paths
  return value.startsWith('/') ? value : `/${value}`;
};

export default function ProductGallery({
  images = [],
  image = '',
  name = '',
  product_family = [],
  specifications = [],
  applications = [],
  className = '',
  show_thumbnails = true,
}) {
  // Normalize gallery images list
  const rawGalleryImages = images && images.length > 0 ? images : image ? [image] : [];
  const galleryImages = rawGalleryImages.map(normalizeImageSrc).filter(Boolean);

  // State for active main image
  const [currentImage, setCurrentImage] = useState(galleryImages[0] || '');
  const [activeThumbIndex, setActiveThumbIndex] = useState(0);

  // State for selected product family variant
  const [selectedFamilyIndex, setSelectedFamilyIndex] = useState(
    product_family.findIndex((item) => item.active) !== -1
      ? product_family.findIndex((item) => item.active)
      : 0
  );

  // Dynamic specifications based on active family variant
  const currentSpecs =
    product_family[selectedFamilyIndex]?.specifications?.length > 0
      ? product_family[selectedFamilyIndex].specifications
      : specifications;

  // State for image zoom / graph modal preview
  const [modalImage, setModalImage] = useState(null);

  // Handle Thumbnail click
  const handleThumbClick = (imgUrl, index) => {
    setCurrentImage(imgUrl);
    setActiveThumbIndex(index);
  };

// Handle Product Family variant switch
  const handleFamilyClick = (index, family) => {
    setSelectedFamilyIndex(index);
    const normalized = normalizeImageSrc(family.image);
    if (normalized) {
      setCurrentImage(normalized);
    }
  };

  return (
    <div className={`product-detail-image-col ${className}`.trim()}>
{/* Main Product Image */}
      <div className="product-detail-image-wrapper ">
       {currentImage ? (
  <Image
    src={currentImage.startsWith('/') ? currentImage : `/${currentImage}`}
    alt={name || 'Main product image'}
    width={600}
    height={400}
    style={{ width: '100%', height: 'auto' }}
    className="product-detail-image img-fluid"
    id="galleryMainImage"
    unoptimized
  />
) : (
          <div className="product-detail-image img-fluid d-flex align-items-center justify-content-center bg-light text-muted">
            No Image Available
          </div>
        )}
        {currentImage && (
          <button
            type="button"
            className="gallery-zoom-btn"
            aria-label="Click to enlarge image"
            onClick={() => setModalImage(currentImage)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
            
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {show_thumbnails && galleryImages.length > 1 && (
        <div className="gallery-thumbnails d-flex gap-2 mt-3" id="galleryThumbnails">
          {galleryImages.map((imgUrl, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-thumb btn p-1 border ${
                activeThumbIndex === i ? 'border-primary active' : 'border-secondary'
              }`}
              onClick={() => handleThumbClick(imgUrl, i)}
              aria-label={`View image ${i + 1} of ${galleryImages.length}`}
            >
              <Image
              width={90}
               height={90}
                src={imgUrl}
                alt={`${name} - image ${i + 1}`}
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Product Family Variants */}
      {product_family && product_family.length > 0 && (
        <div className="quick-specs-wrapper ">
          <span className="section-label">
            OMI PRODUCT FAMILY
          </span>
          <div className="family-grid ">
            {product_family.map((family, index) => {
              const isActive = selectedFamilyIndex === index;
              return (
             <button
                key={index}
                type="button"
                className={`family-badge btn ${
                  isActive ? 'btn-primary active' : 'btn-outline-secondary'
                } text-center`}
                onClick={() => handleFamilyClick(index, family)}
                title={family.name}
              >
  {normalizeImageSrc(family.image) && (
    <Image
      src={normalizeImageSrc(family.image)}
      alt={family.name || 'Family Image'}
      width={90}
      height={90}
      className="me-1"
      style={{ objectFit: 'cover' }}
      unoptimized
    />
  )}
  <span>{family.name}</span>
</button>
              );
            })}
          </div>
        </div>
      )}

      {/* Applications */}
      {applications && applications.length > 0 && (
        <div className="quick-specs-wrapper ">
          <span className="section-label">
            KEY APPLICATIONS
          </span>
          <div className="quick-specs-grid">
            {applications.map((app, idx) => (
              
                <div key={idx} className="quick-spec-card ">
                  <div className="spec-icon mb-1">
                    {APP_ICONS[app.icon] || null}
                  </div>
                  <span className="spec-label d-block small fw-semibold">
                    {app.title}
                  </span>
                </div>
              
            ))}
          </div>
        </div>
      )}

      {/* Quick Specifications */}
      {currentSpecs && currentSpecs.length > 0 && (
        <div className="quick-specs-wrapper">
          <span className="section-label ">
            QUICK SPECIFICATIONS
          </span>
          <div className="quick-specs-grid ">
            {currentSpecs.map((spec, idx) => {
              const isWavelength = spec.label === 'Wavelength Range';
              const hasGraph = isWavelength && spec.graph;

              return (
                
                  <div key={idx} 
                    className={`quick-spec-card ${
                      hasGraph ? 'spec-clickable cursor-pointer bg-light' : ''
                    }`}
                    onClick={() => hasGraph && setModalImage(spec.graph)}
                    style={{ cursor: hasGraph ? 'pointer' : 'default' }}
                  >
                    <span className="spec-label d-block small text-muted">
                      {spec.label}
                    </span>
                    <span className="spec-value d-block fw-bold">
                      {spec.value}
                    </span>
                  </div>
               
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {modalImage && (
    <div
  className="modal d-block bg-dark bg-opacity-75"
  tabIndex="-1"
  onClick={() => setModalImage(null)}
>
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content bg-transparent border-0 text-center">
      <div className="modal-body position-relative">
        <button
          type="button"
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
          onClick={() => setModalImage(null)}
        />
        <Image
          src={normalizeImageSrc(modalImage)}
          alt="Enlarged preview"
          className="img-fluid rounded"
          width={390}
          height={390}
          style={{ width: 'auto', height: 'auto' }}
          unoptimized
        />
      </div>
    </div>
  </div>
</div>
      )}
    </div>
  );
}