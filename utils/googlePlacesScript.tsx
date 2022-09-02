import React from 'react';
import Script from 'next/script';

const source = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBMo5iUpoz9JfAcs-Qm_WzPSfEu2SFrrmU&libraries=places&language=en`;

const GooglePlacesScript = () => {
  return <Script type="text/javascript" src={source} strategy="beforeInteractive" />;
};

export default GooglePlacesScript;
