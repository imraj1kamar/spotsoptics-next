'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  

  const preloaderRef = useRef(null);
  const spinnerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    
    const tl = gsap.timeline({
      onComplete: () => setIsLoading(false) 
    });

    // 1. Spinner ko continuously ghumaane ke liye alag se GSAP
    gsap.to(spinnerRef.current, {
      rotation: 360,
      repeat: -1, // Infinite loop
      duration: 1,
      ease: "linear"
    });

    // 2. Entrance Animation (Zoom In & Reveal)
    tl.fromTo(spinnerRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    )
    .fromTo(textRef.current,
      { y: 30, opacity: 0, letterSpacing: '2px' },
      { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.8, ease: "power3.out" },
      "-=0.4" // Spinner ke aate hi text bhi shuru ho jayega
    )
    
    .to({}, { duration: 0.8 }) 

    // 4. Exit Animation (Smooth & Slow Exit with Transformation)
    .to([spinnerRef.current, textRef.current], {
      y: -30,               
      scale: 0.85,          
      duration: 0.8,       
      stagger: 0.15,        
      ease: "power2.inOut"  
    })
    .to(preloaderRef.current, {
      yPercent: -100,       
      duration: 1.4,        
      ease: "power3.inOut", 
      borderRadius: "0 0 20% 20%" 
    }, "-=0.5"); 
    return () => tl.kill(); 
  }, []);

  if (!isLoading) return null;

  return (
   <div
      ref={preloaderRef}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
      style={{ 
        zIndex: 99999, 
        backgroundColor: 'rgba(35, 32, 32, 0.96)', 
        backdropFilter: 'blur(15px)',            
        WebkitBackdropFilter: 'blur(15px)',    
        overflow: 'hidden' 
      }}
    >
      {/* Custom Glowing Optics Spinner */}
      <div
        ref={spinnerRef}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.05)',
          borderTop: '3px solid var(--primary-blue, #3b82f6)',
          borderRight: '3px solid var(--primary-blue, #3b82f6)',
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
          marginBottom: '24px'
        }}
      />

      {/* Premium Gradient Title */}
      <h4
        ref={textRef}
        className="fw-bold text-uppercase"
        style={{
          margin: 0,
          background: 'linear-gradient(90deg, #ffffff, #93c5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        SpotOptics
      </h4>
    </div>
  );
}