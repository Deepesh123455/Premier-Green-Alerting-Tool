import React from 'react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-3xl font-bold text-[#1a2522] mb-2">404 - Page Not Found</h2>
      <p className="text-[#71817E]">The page you are looking for does not exist on this terminal.</p>
    </div>
  );
};
