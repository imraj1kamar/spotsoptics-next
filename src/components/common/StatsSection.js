// 'use client';

// import React from 'react';

// // Data & CSS Import
// import statsData from '@/data/statsSection.json';
// import '../../../public/assets/css/statsSection.css';

// // Blue SVG Icons matching image
// const ICONS = {
//   INNOVATION: (
//     <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v13m0-13V3.5A2.5 2.5 0 0114.5 1h-5A2.5 2.5 0 007 3.5V8m5 0h8.5a2.5 2.5 0 012.5 2.5v7.5A2.5 2.5 0 0120.5 20.5H3.5A2.5 2.5 0 011 18V10.5A2.5 2.5 0 013.5 8H12z" />
//     </svg>
//   ),
//   SYSTEMS: (
//     <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//     </svg>
//   ),
//   GLOBE: (
//     <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
//       <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1.8" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
//     </svg>
//   ),
//   SUPPORT: (
//     <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   ),
// };

// export default function StatsSection() {
//   const statsList = Array.isArray(statsData) ? statsData : [];

//   return (
//     <section className="stats-section-wrapper py-4" id="stats">
//       <div className="container">
//         <div className="stats-card-box p-4 p-md-4 rounded-4 shadow-sm bg-white border">
//           <div className="row g-4 justify-content-center justify-content-md-start">
//             {statsList.map((item, index) => (
//               <div
//                 key={item.id || index}
//                 className={`col-6 col-md-3 ${
//                   index < statsList.length - 1 ? 'border-end-md' : ''
//                 }`}
//               >
//                 <div className="d-flex align-items-center gap-3 justify-content-center justify-content-md-start px-md-2">
//                   {/* Icon */}
//                   <div className="stats-icon-wrapper text-primary flex-shrink-0">
//                     {ICONS[item.icon_type] || ICONS.INNOVATION}
//                   </div>

//                   {/* Value & Label */}
//                   <div>
//                     <h3 className="stats-value fw-bold mb-0 text-dark">
//                       {item.value}
//                     </h3>
//                     <p className="stats-label text-muted mb-0 small">
//                       {item.label}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';

import React from 'react';

// Data & CSS Import
import statsData from '@/data/statsSection.json';
import '../../../public/assets/css/statsSection.css';

// SVG Icons
const ICONS = {
  INNOVATION: (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v13m0-13V3.5A2.5 2.5 0 0114.5 1h-5A2.5 2.5 0 007 3.5V8m5 0h8.5a2.5 2.5 0 012.5 2.5v7.5A2.5 2.5 0 0120.5 20.5H3.5A2.5 2.5 0 011 18V10.5A2.5 2.5 0 013.5 8H12z" />
    </svg>
  ),
  // ... baki icons agar future mein use karne ho
};

export default function StatsSection() {
  const statsList = Array.isArray(statsData) ? statsData : [];

  // Marquee ko seamlessly loop karne ke liye data ko multiple times repeat kar rahe hain
  // Taki screen khali na rahe
  const repeatedStats = Array(10).fill(statsList).flat();

  return (
    <section className="stats-marquee-wrapper py-3" id="stats">
      <div className="container-fluid px-0">
        <div className="marquee-container bg-white border-top border-bottom py-3 shadow-sm">
          <div className="marquee-content">
            {repeatedStats.map((item, index) => (
              <div key={`${item.id}-${index}`} className="marquee-item">
                
                {/* Icon */}
                <div className="stats-icon-wrapper" style={{ color: '#42B1A2' }}>
                  {ICONS[item.icon_type] || ICONS.INNOVATION}
                </div>

                {/* Text / Stats */}
                <div className="d-flex align-items-baseline gap-2">
                  <h3 className="fw-bold mb-0 text-dark">
                    {item.value}
                  </h3>
                  <p className="text-muted mb-0 fw-medium">
                    {item.label}
                  </p>
                </div>
                
                {/* Divider Dot/Separator (optional) */}
                <span className="marquee-divider mx-4 text-muted">•</span>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}