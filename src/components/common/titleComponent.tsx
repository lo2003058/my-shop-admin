'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

interface TitleProps {
  title: string;
  routeName?: string;
  isShowBackButton?: boolean;
  isShowCreateButton?: boolean;
}

const TitleComponent: React.FC<TitleProps> = (
  {
    title,
    routeName,
    isShowBackButton = false,
    isShowCreateButton = false,
  }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between px-4 w-full">
      {/* Left Side: Back Button and Title */}
      <div className="flex items-center space-x-4">
        {isShowBackButton && (
          <button
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-6 w-6" />
          </button>
        )}

        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>

      {/* Right Side: Create Button */}
      {isShowCreateButton && routeName && (
        <Link
          href={`${routeName}/create`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <FontAwesomeIcon
            icon={faPlus}
            className="mr-2 h-5 w-5"
            aria-hidden="true"
          />
          Create
        </Link>
      )}
    </div>
  );
};

export default TitleComponent;
