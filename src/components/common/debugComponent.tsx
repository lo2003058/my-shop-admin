import React from 'react';

interface DebugComponentProps {
  content: any;
}

const DebugComponent = ({ content }: DebugComponentProps) => {
  return (
    <>
      <p
        className="mt-4 text-gray-500 text-sm">
        {
          content && typeof content === 'object' ? JSON.stringify(content, null, 2) : content
        }
      </p>
    </>
  );
};

export default DebugComponent;
