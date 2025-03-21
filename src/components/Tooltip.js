import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Tooltip = ({ content, isVisible, position = 'top', delay = 0 }) => {
  const tooltipRef = useRef(null);
  const { theme } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [positionStyle, setPositionStyle] = useState({});

  useEffect(() => {
    // Add a slight delay before showing the tooltip
    let timer;
    if (isVisible) {
      timer = setTimeout(() => {
        setShowContent(true);
      }, delay);
    } else {
      setShowContent(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, delay]);

  useEffect(() => {
    if (tooltipRef.current && showContent) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const positions = {
        top: { transform: 'translate(-50%, -100%)', top: '-8px', left: '50%' },
        bottom: { transform: 'translate(-50%, 8px)', top: '100%', left: '50%' },
        left: { transform: 'translate(-100%, -50%)', top: '50%', left: '-8px' },
        right: { transform: 'translate(8px, -50%)', top: '50%', left: '100%' }
      };

      setPositionStyle(positions[position] || positions.top);
    }
  }, [showContent, position]);

  if (!showContent) return null;

  return (
    <div
      ref={tooltipRef}
      className={`
        absolute z-50 p-2 rounded shadow-lg 
        ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-800 text-white'}
        border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
        transition-opacity duration-200
        ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
      style={positionStyle}
    >
      {content}
    </div>
  );
};

export default Tooltip; 