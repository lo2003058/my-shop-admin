'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/utils/permissionChecker';

interface TitleProps {
  title: string;
  routeName?: string;
  isShowBackButton?: boolean;
  isShowCreateButton?: boolean;
  isShowTrashedButton?: boolean;
  createButtonOnClick?: () => void;
}

const TitleComponent: React.FC<TitleProps> = (
  {
    title,
    routeName = '',
    isShowBackButton = false,
    isShowCreateButton = false,
    isShowTrashedButton = false,
    createButtonOnClick,
  },
) => {
  const router = useRouter();
  const { data: session } = useSession();

  const pathname = usePathname().replace('/', '');

  // Get user permissions from the session.
  const userPermissions: string[] = session?.user?.role?.permissions || [];

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
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Right Side: Buttons Container */}
      <div className="flex items-center space-x-4">

        {isShowCreateButton && hasPermission(userPermissions, pathname, 'create') && (
          <button
            onClick={createButtonOnClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-5 w-5" />
            Create
          </button>
        )}

        {isShowTrashedButton && hasPermission(userPermissions, pathname, 'delete') && (
          <Link
            href={`/${routeName}/trashed`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2 h-5 w-5" />
            Trashed
          </Link>
        )}
      </div>
    </div>
  );
};

export default TitleComponent;
