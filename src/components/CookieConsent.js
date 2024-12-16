import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
      <p>
        We use cookies to improve your experience on our site. By using our site, you agree to our{' '}
        <a href="/cookie-policy" className="underline text-yellow-400">
          Cookie Policy
        </a>.
      </p>
      <div>
        <button onClick={handleAccept} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2">
          Accept
        </button>
        <button onClick={handleDecline} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
