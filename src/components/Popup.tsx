'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Popup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Set a timer to show the popup after 2 seconds
    const timer = setTimeout(() => {
      // Check if we've already shown the popup
      const hasShown = sessionStorage.getItem('popupShown');
      if (!hasShown) {
        setShowPopup(true);
        // Mark that we've shown the popup
        sessionStorage.setItem('popupShown', 'true');
      }
    }, 2000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  // If showPopup is false, don't render anything
  if (!showPopup) {
    return null;
  }

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% opacity
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          aria-label="Close popup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {/* Popup image */}
        <div style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
          <Image
            src="/images/popup.jpg"
            alt="Welcome to ReEnvision"
            width={500}
            height={300}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      </div>
    </div>
  );
}
