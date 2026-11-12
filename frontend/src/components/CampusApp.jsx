import React, { useEffect } from 'react';

/**
 * CampusApp — loads your original CampusIQ HTML app inside an iframe.
 * The iframe gives it full isolation so all its scripts, styles and routing
 * work exactly as you originally built them.
 */
const CampusApp = () => {
  return (
    <iframe
      src="/legacy.html"
      title="CampusIQ"
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
  );
};

export default CampusApp;
