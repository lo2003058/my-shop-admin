'use client';

import React from 'react';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    ...pathSegments.map((segment, idx) => ({
      name: segment,
      href: '/' + pathSegments.slice(0, idx + 1).join('/'),
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex border-b border-gray-200 bg-white h-12">
      <ol
        role="list"
        className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8 items-center"
      >
        {breadcrumbItems.map((item, index) => {
          const isClickable =
            index === 0 ||
            (index === 1 && breadcrumbItems.length === 2) ||
            (index === 1 && breadcrumbItems.length > 2);

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="h-full w-6 shrink-0 text-gray-200"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
              )}
              {isClickable ? (
                <Link
                  href={item.href}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 capitalize"
                >
                  {index === 0 ? (
                    <>
                      <FontAwesomeIcon icon={faHome} className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Home</span>
                    </>
                  ) : (
                    <span className="ml-4 text-sm font-medium text-gray-500 capitalize">
                      {item.name}
                    </span>
                  )}
                </Link>
              ) : (
                <span className="ml-4 text-sm font-medium text-gray-500 capitalize select-none">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
