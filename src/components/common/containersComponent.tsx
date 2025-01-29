import React from 'react';

interface ContainersProps {
  children: React.ReactNode;
}

const ContainersComponent = ({ children }: ContainersProps) => {
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-4 sm:py-6">
      {children}
    </div>
  );
};

export default ContainersComponent;
