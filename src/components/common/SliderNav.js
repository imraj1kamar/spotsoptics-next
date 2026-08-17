import React from 'react';

export default function SliderNav({
  prevClass = 'slider-nav-btn',
  nextClass = 'slider-nav-btn',
  wrapperClass = '',
  size = 20,
  type = 'button',
  onPrev,
  onNext,
  prevProps = {},
  nextProps = {},
}) {
  // Element type (button ya div)
  const Tag = type === 'button' ? 'button' : 'div';

  // Extra attributes logic for button type
  const baseButtonProps = type === 'button' ? { type: 'button' } : {};

  return (
    <div className={`d-flex gap-2 ${wrapperClass}`.trim()}>
      {/* Previous Button */}
      <Tag
        className={prevClass}
        onClick={onPrev}
        aria-label="Previous slide"
        {...baseButtonProps}
        {...prevProps}
      >
        <svg
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Tag>

      {/* Next Button */}
      <Tag
        className={nextClass}
        onClick={onNext}
        aria-label="Next slide"
        {...baseButtonProps}
        {...nextProps}
      >
        <svg
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Tag>
    </div>
  );
}