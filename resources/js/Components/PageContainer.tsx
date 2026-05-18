import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard page wrapper. Enforces consistent spacing across the site:
 * - 16px horizontal padding on mobile, 32px from md+
 * - Top padding clears the fixed navbar
 * - Generous bottom padding
 * - Max width for readability
 */
export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => (
  <div className={`pt-32 md:pt-40 pb-20 md:pb-24 px-4 md:px-8 max-w-6xl mx-auto ${className}`}>
    {children}
  </div>
);
