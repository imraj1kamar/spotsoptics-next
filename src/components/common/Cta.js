import React from 'react';
import Link from 'next/link';
import Data from "@/data/cta.json";

// CSS ko styles folder ya CSS module se import karein
import "../../../public/assets/css/cta.css"; 

export default function Cta() {
  const cta = Data;

  // Agar title na ho toh component render na ho
  if (!cta?.title) return null;

  return (
    <section className="tech-cta-section">
      <div className="container">
        <div className="tech-cta-card">
          <div className="row align-items-center g-4">
            
            {/* Left Content */}
            <div className="col-lg-7">
              <div className="d-flex align-items-start gap-3">
                <div className="tech-icon">
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-16 10h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="tech-cta-title mb-2">{cta.title}</h3>
                  {cta.description && (
                    <p className="tech-cta-text mb-0">{cta.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="col-lg-5">
              <div className="d-flex flex-wrap justify-content-lg-end gap-3">
                
                {/* Primary Button */}
                {cta.primary_button?.label && (
                  <Link
                    href={cta.primary_button.url || "/contact"}
                    className="btn tech-btn-primary"
                  >
                    {cta.primary_button.label}
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                )}

                {/* Secondary Button */}
                {cta.secondary_button?.label && (
                  <Link
                    href={cta.secondary_button.url || "/applications"}
                    className="btn tech-btn-outline"
                  >
                    {cta.secondary_button.label}
                  </Link>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}