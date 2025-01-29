import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'under';
  children: React.ReactNode;
}

export default function Tooltip({
                                  text,
                                  position = 'top',
                                  children,
                                }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [transform, setTransform] = useState('');
  const triggerRef = useRef<HTMLDivElement | null>(null);

  // Distance from the element so the arrow is visible
  const offset = 12;

  // Decide layout: vertical for top/bottom/under, horizontal for left/right
  const isVertical = position === 'top' || position === 'bottom' || position === 'under';

  // Decide arrow order: if bottom/right => arrow first; else arrow last
  const isArrowFirst = position === 'bottom' || position === 'right' || position === 'under';

  // On hover in/out, update visibility
  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  // Position the tooltip in a portal
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;
      let translate = '';

      switch (position) {
        case 'top':
          top = rect.top - offset;
          left = rect.left + rect.width / 2;
          translate = 'translate(-50%, -100%)';
          break;

        case 'bottom':
        case 'under':
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2;
          translate = 'translate(-50%, 0)';
          break;

        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - offset;
          translate = 'translate(-100%, -50%)';
          break;

        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + offset;
          translate = 'translate(0, -50%)';
          break;
      }

      setCoords({ top, left });
      setTransform(translate);
    }
  }, [isVisible, position]);

  /** Arrow style classes based on position */
  const arrowClasses = (() => {
    switch (position) {
      case 'top':
        // Arrow pointing DOWN => top border colored
        return `
          w-0 h-0
          border-l-4 border-r-4 border-t-4
          border-l-transparent border-r-transparent border-t-gray-800
        `;
      case 'bottom':
      case 'under':
        // Arrow pointing UP => bottom border colored
        return `
          w-0 h-0
          border-l-4 border-r-4 border-b-4
          border-l-transparent border-r-transparent border-b-gray-800
        `;
      case 'left':
        // Arrow pointing RIGHT => left border colored
        return `
          w-0 h-0
          border-t-4 border-b-4 border-l-4
          border-t-transparent border-b-transparent border-l-gray-800
        `;
      case 'right':
        // Arrow pointing LEFT => right border colored
        return `
          w-0 h-0
          border-t-4 border-b-4 border-r-4
          border-t-transparent border-b-transparent border-r-gray-800
        `;
    }
  })();

  // If there's no tooltip text, just render children
  if (!text) {
    return (
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
    );
  }

  // The actual tooltip node (arrow + text), portaled to <body>
  const tooltipNode = isVisible ? (
    <div
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        transform,
        zIndex: 9999999,
      }}
      className={`
        pointer-events-none
        flex
        ${isVertical ? 'flex-col items-center' : 'flex-row items-center'}
      `}
    >
      {/* Arrow First? (for bottom/right/under) */}
      {isArrowFirst && (
        <div className={arrowClasses} />
      )}

      {/* Tooltip Text */}
      <div className="rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-lg">
        {text}
      </div>

      {/* Arrow Last? (for top/left) */}
      {!isArrowFirst && (
        <div className={arrowClasses} />
      )}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {typeof window !== 'undefined'
        ? ReactDOM.createPortal(tooltipNode, document.body)
        : null}
    </>
  );
}
