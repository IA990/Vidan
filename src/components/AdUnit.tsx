import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

export default function AdUnit({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);
      if (adsbygoogle.loaded) return; // Already initialized
      adsbygoogle.push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: 'block' }}
         data-ad-client={import.meta.env.VITE_ADSENSE_ID}
         data-ad-slot={slot}
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
}
