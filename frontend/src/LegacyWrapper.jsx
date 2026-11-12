import React, { useEffect, useRef } from "react";

/**
 * LegacyWrapper loads the static legacy.html file (generated from the original
 * code you supplied) and injects its contents into the DOM. The component uses
 * `dangerouslySetInnerHTML` because the original page already includes its own
 * script tags that rely on being part of the document.
 */
const LegacyWrapper = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Fetch the legacy HTML file from the public folder.
    fetch("/legacy.html")
      .then((res) => res.text())
      .then((html) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = html;
        }
      })
      .catch((err) => console.error("Failed to load legacy page:", err));
  }, []);

  return <div ref={containerRef} />;
};

export default LegacyWrapper;
